---
title: "Launching Apps from the macOS Terminal"
date: 2019-10-18T15:34:30-04:00
categories:
  - blog
tags:
  - command-line
  - macOS
---

![launch demo](/assets/images/launch-demo.gif)

Using [fzf](https://www.github.com/junegunn/fzf) and Unix pipes, I hacked together a fuzzy command line launcher for `zsh`. You can add this snippet to your `.zshrc` to get this functionality. Remember to source your `~/.zshrc` to process the changes in your shell session.

```zsh
launch () {
	open -a "`find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf --query=$1`"
}
```

## How it works

Let's break down how this command works.

First, we have to get a list of all the applications in the `/Applications` directory. We'll do this using the `find` command.

```bash
$ find /Applications -name '*app' -maxdepth 1
/Applications/Siri.app
/Applications/Visual Studio Code.app
/Applications/OWASP ZAP.app
/Applications/QuickTime Player.app
/Applications/Signal.app
...
```

Now, we could just display this list in `fzf` for a user to choose from, but I'd like to clean up the app names by removing `/Applications/` and `.app` from each option. We can do that by joining two `cut` commands. This first cut trims everything before the 2nd `/`.

```bash
$ find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3
Siri.app
Visual Studio Code.app
OWASP ZAP.app
QuickTime Player.app
Signal.app
...
```

Then we pipe that into a second cut to get rid of the `.app` suffix.

```bash
$ find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1
Siri
Visual Studio Code
OWASP ZAP
QuickTime Player
Signal
...
```

And now we can pipe this into `fzf` to get a nice, fuzzy-searchable interface.

```bash
$ find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf
```

![fzf find demo](/assets/images/fzf-demo-find.gif)

That's nice, but sometimes I know a portion of the app name and can start searching before the `fzf` prompt is brought up. We can implement that with `fzf`'s `--query` option. If we wrap this command inside a `zsh` function, arguments can be passed to it.

```bash
launch () {
	find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf --query=$1
}
```

This function will go through the process of extracting all application names and displaying them in a `fzf` window, and will also pre-fill the `fzf` search with an argument you can pass in, like this:

```bash
$ launch Spotif
# Note that this will still work with no search parameters, since the first argument ($1) will evaluate to ""
$ launch
```

At this point, we are able to search through a list of applications and get whichever one is selected printed to standard output by `fzf`. Now, we need to actually open whatever is selected. `macOS` comes with a nice tool to open files and applications, called `open`. Check out `$ man open` if you're interested in learning more about it.

We can use it by simply piping the output from `fzf` into the `open` command with the `-a` flag, specifying we want to open an Application. To make this work, we need to use a `bash` feature called ["Command Substitution"](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Command-Substitution). This will allow us to use the standard output of the `fzf` command in another command to actually open the application.

```zsh
launch () {
	open -a "`find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf --query=$1`"
}
```

Note: The surrounding double-quotes on the command substitution are important for handling cases where the app name contains a space. Let's take a look at an example:

```zsh
$ open -a QuickTime Player.app
The file /Users/alichtman/Player.app does not exist.
# Error!

$ open -a "QuickTime Player.app"
# QuickTime opens
```

In the first example, the shell split the arguments to `open -a` on the space, treating `QuickTime` and `Player.app` as two separate files to open. The double-quotes tell the shell not to word split.

Shell scripting is a little tricky at first (and continues to be tricky, even as you get better at it), but you can create some incredibly powerful workflows with it. It's well worth investing the time in learning some basic shell scripting!
