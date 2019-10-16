---
title: "Fuzzy Launching Applications from the Shell on macOS"
date: 2019-10-18T15:34:30-04:00
categories:
  - blog
tags:
  - command-line
  - macOS
---

Using [fzf](https://www.github.com/junegunn/fzf) and some UNIX pipes, I wrote a fuzzy command line launcher for `zsh`. You can add this snippet to your `.zshrc` to get this functionality. Remember to run `$ source ~/.zshrc` to process your changes.

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

Now, we could just display this list in `fzf` for a user to choose from, but we could clean up the interface by removing `/Applications/` and `.app` from each of the options. We can do that by joining two `cut` commands. This first cut trims everything before the 2nd `/`.

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

![fzf find demo](../assets/gifs/fzf-demo-find.gif)

That's nice, but sometimes I'd like to be able to start searching in the initial command that I run. Luckily, we can do that with `fzf`'s `--query` option. If we wrap this command inside a `zsh` or `bash` function, we can pass arguments to it from the command prompt.

```bash
app_search_demo () {
	find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf --query=$1
}
```

This function will go through the process of extracting all application names and displaying them in a `fzf` window, and will also pre-fill the `fzf` search with an argument you can pass in, like this:

```bash
$ app_search_demo Spotif
# Note that it will still work with no search parameters
$ app_search_demo
```

At this point, we are able to search through a list of applications and get whichever one is selected printed to standard output by `fzf`. Now, we need to actually open whatever is selected. `macOS` comes with a nice tool to open files and applications, called `open`. Check out `$ man open` if you're interested in learning more about it. We can use it by simply piping the output from `fzf` into the `open` command with the `-a` flag, specifying we want to open an Application. To make this work, we need to use a `bash` feature called ["Command Substitution"](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Command-Substitution). This will allow us to use the standard output of the `fzf` command in another command to actually open the application. Think of this sort of like order of operations in a mathematical expression, where you must first evaluate the expressions in parenthesis and then you can complete the evaluation of the other expressions. 

```zsh
launch () {
	open -a "`find /Applications -name '*app' -maxdepth 1 | cut -d'/' -f 3 | cut -d'.' -f 1 | fzf --query=$1`"
}
```

