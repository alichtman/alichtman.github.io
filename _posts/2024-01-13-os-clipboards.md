---
title: "Sane Behavior for OS Clipboards"
date: 2024-01-13T05:56:30-04:00
categories:
    - blog
tags:
    - macOS
    - linux
toc: true
toc_label: "Table of Contents"
toc_icon: "cog"
---

An easily searchable clipboard manager that retains extended history is a part of key workflows; and should be configured by default.
{: .notice--info}

## Where does it hurt?

[![where does it hurt](/assets/images/where-does-it-hurt-clipboard.jpg)](/assets/images/where-does-it-hurt-clipboard.jpg){: .align-center}

I expect system clipboards to do **one thing -- store text and let me paste it later**. If you're counting along and got two things, you are _off-by-one_. This is one of the [two hard problems in CS](https://martinfowler.com/bliki/TwoHardThings.html).

For reasons I will never understand, the default `macOS` and `linux` clipboards hold a max of one (1) item.

## This sucks! Let's walk through why...

Imagine you are copying two sections from `File 1` to `File 2`.

```
┌────────────────────────────────────┐           ┌─────────────────────────┐
│  File 1                            │           │ File 2                  │
├────────────────────────────────────┤           ├─────────────────────────┤
│  First section to copy             │ ────────> │ First section to copy   │
│  You don't care about this section │           │ Second section to copy  │
│  Second section to copy            │           └─────────────────────────┘
└────────────────────────────────────┘
```

You open VS Code (we'll ignore `vim` workflows for this example, since you can use registers as a clipboard manager), and split the screen vertically: `File 1` on the left, `File 2` on the right.

1. Copy the first section from `File 1`
    - Drag cursor to select text (or click and use `Shift+Arrows`)
    - `Ctrl-C`
2. Paste it into `File 2`
    - Change file focus, and place cursor where you want to paste
    - `Ctrl-V`
3. Copy the second section from `File 1`
    - Change file focus **again**, and select text
    - `Ctrl-C`
4. Paste it into `File 2`
    - Change file focus **yet again**
    - `Ctrl-V`

You're done -- but you had to change file focus **three times**. That's two more times than you should have to.

## What \*should\* happen?

With a clipboard that retained your copy history, the workflow could be:

1. Copy the first section from `File 1`
    - Select text
    - `Ctrl-C`
2. Copy the second section from `File 1`
    - Select text
    - `Ctrl-C`
3. Paste both sections into `File 2`
    - Change file focus
    - `Ctrl-V`
    - Open clipboard history, select item at index 1[^1], and paste again

[^1]: Since all (useful) clipboards will store history using a stack, the last item (located at index 0) copied will be pasted when you press `Ctrl-V`. The item at index 1 will be the second-to-last thing you copied, and so on.

## Moving at the speed of thought: `vim` and `tmux`

If you read this section, and your eyes glaze over, don't worry! Skip to [Clipboard Manager Setup](#clipboard-manager-setup) and come back to `vim` some other time :) You will get a bunch of value out of this post anyways.
{: .notice--primary}

You can perform the above task in `vim` using the default settings, without ever taking your hands off the keyboard. You'll ~~break things~~ **build stable infra** faster by learning CLI / modal-editing workflows (and obsessing over [`nvim` and `tmux` configs](https://github.com/alichtman/dotfiles)).
{: .notice--info}

[![break things faster](/assets/images/move-fast.webp)](/assets/images/move-fast.webp){: .align-center}
<cite>[Image attributed to Facebook](https://medium.com/swlh/move-fast-and-break-things-is-not-dead-8260b0718d90)</cite>
{: .small}

Although, what limits me is definitely not the speed at which I can operate my computer. If only it were as straightforward to type _better things_ as it is to _type things faster_ :)

### `vim` Workflow

Here's a `vim` workflow that doesn't require a clipboard manager (using [`vim` registers](https://learnvim.irian.to/basics/registers) instead):

```
# Open the first file
$ vim file1.txt

# Move cursor to the first character (0) of the first line (gg) -- which is F
gg0

# Yank the line (yy) into the a register ("a)
"ayy

# Go down two lines
2j

# Yank the second line (yy) into the b register ("b)
"byy

# Open the second file in a vertical split (vs)
:vs file2.txt

# Move focus (Ctrl-w) to next window (l)
Ctrl-w l

# Paste (p) the a register ("a)
"ap

# Add a newline (o) and immediately go back to normal mode (<ESC>)
o<ESC>

# Paste (p) the b register ("b)
"bp

# Save the file (:w) and quit (:q)
:wq
```

Registers are awesome for working _inside_ of `vim` but aren't exposed _outside_ of `vim`. This means we can't use them as the clipboard manager, even though they roughly have the behavior I'm looking for. Here's a peek at what's currently in my `vim` registers while I'm working on this article.

-   The register name is on the left
-   Its content is displayed in the middle
-   Some of them have nice descriptions on the right

[![vim registers](/assets/images/vim-registers.png)](/assets/images/vim-registers.png){: .align-center}
<cite>You can click on the image to make it larger</cite>
{: .small}

There are two special registers for the system clipboard, called [selection registers](https://learnvim.irian.to/basics/registers#the-selection-registers). If you want to copy text from inside `vim` and paste it outside of `vim`, you need to copy to them explicitly (`"+y`). For more reasons I will never understand, copying to the system clipboard isn't the default copy behavior.

[Tell `vim` to copy to the system clipboard by default](https://vim.fandom.com/wiki/Accessing_the_system_clipboard) by adding the following setting in your `init.lua` file:

```lua
vim.opt.clipboard = "unnamedplus"
```

After doing that, the workflow becomes:

```
# Open the first file
$ vim file1.txt
gg0

# Copy line to system clipboard
yy
2j
yy
:vs file2.txt
Ctrl-w l
# Paste from system clipboard register
p

# Open the clipboard manager -- read the next section!
Shift-Alt-Super-V

# Set the clipboard to the second-to-last item in the clipboard history
Down Arrow

# Paste from clipboard
p
:wq
```

Which is ... pretty slick. If (when) you become a `vim` addict, you'll be able to do this without thinking about it.

### `tmux`

To make `tmux` and the system clipboard play nicely together, I use [`tmux-yank`](https://github.com/tmux-plugins/tmux-yank) in my [`tmux.conf`](https://github.com/alichtman/dotfiles/blob/main/.config/tmux/tmux.conf#L197).

## Clipboard Manager Setup

Now that `vim` and `tmux` are hooked up to the system clipboard, I need to set up the clipboard manager to keep track of the history, searching, etc. I primarily work on `macOS` and `Linux` machines, and have a clipboard manager workflow for each.

### Clipboard Manager Requirements

-   Efficient clipboard history storage and retrieval
-   User-friendly and searchable clipboard history
-   Media (images/videos) support in the clipboard
    -   Optional media preview
-   Consistent keychord for the clipboard manager across all OSes
    -   Unique keybinding to avoid conflicts with other tools

### Keychord Configuration

I set the `macOS` keychord to `Shift+Cmd+Option+V` and the Linux keychord to `Shift+Alt+Super+V`.

You might be thinking: _"Man, you literally just said you wanted to use the same keychords on every system"_. I use a [Razer Chroma Ornata](https://www.amazon.com/Razer-Ornata-Gaming-Keyboard-Spill-Resistant/dp/B09X6FKCBD) keyboard for my Linux machine, and the built-in Apple Keyboard for my macOS machine. **The keychords are identical in terms of where the keys are on the keyboards**, so my muscle memory works no matter which system I'm on.

### Ubuntu Linux (with GNOME)

I use [`greenclip`](https://github.com/erebe/greenclip) integrated with [`rofi`](https://github.com/davatorium/rofi) to manage my clipboard history. Note that it does not provide media previews, and can only handle [small images](https://github.com/erebe/greenclip#faq). If that's a critical feature set, check out [Pano](https://github.com/oae/gnome-shell-pano).

[![greenclip](/assets/images/rofi-greenclip.jpg)](/assets/images/rofi-greenclip.jpg){: .align-center}

Using GNOME Keyboard Custom Shortcuts, I map `rofi -modi 'clipboard:~/bin/greenclip print' -show clipboard` to the keychord I mentioned above.

![gnome keyboard shortcuts](/assets/images/gnome-clipboard-shortcut.png){: .align-center}

### macOS

I install [`Maccy`](https://github.com/p0deje/Maccy) with `brew`. It's a performant, free and open-source, native macOS app that is intuitive to use.
{% capture fig_img %}
![maccy](/assets/images/maccy.png)
{% endcapture %}

{% capture fig_caption %}
It leaves you wondering: Why hasn't Apple shipped this as part of the core OS?
{% endcapture %}

<figure>
  {{ fig_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>{{ fig_caption | markdownify | remove: "<p>" | remove: "</p>" }}</figcaption>
</figure>

-   `macOS` has a reputation for **Just Working™**

-   The `macOS` clipboard manager **does NOT Just Work™**

Interesting note: `Cut / Copy / Paste` was [invented by Larry Tesler](http://worrydream.com/refs/Tesler%20-%20A%20Personal%20History%20of%20Modeless%20Text%20Editing%20and%20Cut-Copy-Paste.pdf) in the 70s. Tesler became the systems software lead for the Apple Lisa, and eventually Apple's chief scientist in 1993.

### Windows

Surprisingly, `Windows` seems to be the only OS that gets this part right. The default clipboard manager has a built-in clipboard history. However, the default file manager (in **2024!!!**) still reports all file sizes in `KB`, so rest assured that there is plenty left to complain about.

## Sane Defaults

It's _great_ that I can make this all work. But it's kind of ridiculous that I need to configure it myself. I consider these features to be **basic functionality** that should be configured by default.

Jeff Atwood (Stack Overflow co-founder) had similar things to say about the Windows Vista introduction of [typing to search for files, executables, emails, etc in the Start Menu](https://blog.codinghorror.com/typing-trumps-pointing/):

> ... with Vista, typing to navigate is now quite literally the cornerstone of the operating system. I've gone from tedious, manually defined hotkeys and shortcuts in Windows XP to simply typing what I want and letting the computer find it for me. It also utterly obsoletes the Start, Run menu because it works for file paths.
>
> There are dozens of third-party solutions that deliver very similar interactive full-text search UI experiences. But **there's one key difference between those solutions and the one in Vista: I have to install them**. You may argue that, in the near term, I also have to install Vista. Fair enough. But over the next five years, millions of users will buy computers with Vista pre-installed. And they'll immediately benefit from the built-in, default full-text search UI that's accessible right out of the box with a single press of the Windows key.

[<cite>Jeff Atwood</cite> --- **"The Power of Defaults"**](https://blog.codinghorror.com/the-power-of-defaults/), 2007
{: .small}

I wish macOS and GNOME provided these clipboard manager features by default -- _batteries included_. More people would use them, and the effort to figure out how to nicely build and integrate these features wouldn't be duplicated by me and other engineers.

## Security Issues with the Clipboard Manager Experience

I'd love to see clipboard managers provide first class support for sensitive strings (passwords, SSNs, SSH private keys, etc). The current _"all text in the clipboard is equal"_ approach has a few flaws:

1. Imagine you get toast confirmations when you copy a string. If you are streaming your desktop somewhere and you copy a password from a password manager, the toast will leak your password.

1. Some clipboard managers provide a ["private mode" command](https://github.com/p0deje/Maccy#ignore-copied-items) to stop clipboard history logging for a period of time. If you forget to turn it on, or your clipboard manager doesn't support this, you're forced to clear the entire clipboard history to remove sensitive strings.

    a. `greenclip` doesn't have this feature, and also does not let you delete individual history lines easily. You can only clear the entire clipboard history. I'd add the feature, but it's written in Haskell, and I would rather rewrite it in ... any other language (`rust`, maybe).

1. `greenclip` will happily write your copied password to the clipboard manager cache file, where it can be read by any program running with your user permissions.

I'll demonstrate this with a password copied from [`1Password`](https://1password.com/).

![](/assets/images/1password.png){: .align-center}

```bash
$ ls -lah $XDG_CACHE_HOME/greenclip.history
.rw------- alichtman alichtman 6.2 KB Sun Jan 14 2024 02:57:41 PM  /home/alichtman/.cache/greenclip.history

$ xxd -l 200 $XDG_CACHE_HOME/greenclip.history
00000000: 0000 0000 0000 0064 0000 0000 0000 0000  .......d........
00000010: 0000 0000 0000 0000 1531 7061 7373 776f  .........1passwo
00000020: 7264 5465 7374 5061 7373 776f 7264 0000  rdTestPassword..
00000030: 0000 0000 0000 0000 0000 0000 0000 1531  ...............1
00000040: 7061 7373 776f 7264 5465 7374 5573 6572  passwordTestUser
00000050: 6e61 6d65 0000 0000 0000 0000 0000 0000  name............
00000060: 0000 0000 5359 6f75 2061 7265 2065 6974  ....SYou are eit
00000070: 6865 7220 7265 7370 6f6e 7369 626c 6520  her responsible
00000080: 666f 7220 636c 6561 7269 6e67 2074 6865  for clearing the
00000090: 2063 6163 6865 206f 6e20 796f 7572 206f   cache on your o
000000a0: 776e 2028 6024 2067 7265 656e 636c 6970  wn (`$ greenclip
000000b0: 2063 6c65 6172 6029 0000 0000 0000 0000   clear`)........
000000c0: 0000 0000 0000 0000                      ........
```

The test username and test password are clearly seen in the first `50B` of the file. You are either responsible for clearing the cache on your own (`$ greenclip clear`) or waiting for the sensitive string to get paged out of the cache (the default is 50 copied items).

In addition to the [clipboard text being sniffable by any application that can run as you](https://attack.mitre.org/techniques/T1115/), it's just not great to leave sensitive data sitting around unencrypted.

The native `macOS` clipboard doesn't suffer from the same issue that `greenclip` does since it only remembers one item. A short time after copying a password to the clipboard, many password managers will copy an empty string -- effectively removing the sensitive data from the clipboard.

### How Could Schematized Clipboard Data Help?

**I want my clipboard to understand what kind of data it's holding.**

If I copy an SSH private key and go to paste it into a GitHub comment, I want my clipboard manager to go:

![you sure about that?](/assets/gifs/you-sure-about-that.gif){: .align-center}

Or if I copy my Google password out of 1Password and [some random app tries to read the clipboard](https://attack.mitre.org/techniques/T1115/):

![no clipboard for you](/assets/images/no-clipboard-meme.jpg){: .align-center}

Or maybe you want to lock down what programs can write to your clipboard when you [copy a bitcoin address](https://www.bleepingcomputer.com/news/security/new-clipboard-hijacker-replaces-crypto-wallet-addresses-with-lookalikes/).

There seems to be a lot of opportunity here.

### What a Schematized Clipboard Protocol Could Look Like

Clients (like 1Password, or other password managers) would send their passwords to the clipboard with something like the following format:


```json
{
    "data": "Data to be copied to the clipboard",
    "type": ClipboardDataType.PASSWORD
    "magicString": "0xSOMEMAGIC"
}
```

Clipboard managers would attempt to parse every copied string into this format. If it fails to parse properly, the clipboard manager will assume that it's raw text and treat it as such. The only edge case here is where you're copying a string that matches this format, but is really meant to be raw text (like if you copied the `JSON` blob above.)

`ClipboardDataType` might look something like:

```javascript
enum ClipboardDataType {
    PASSWORD,
    SSH_KEY,
    UNSENSITIVE,
    SENSITIVE_GENERIC,
    ...
}
```

It would be great to then be able to configure what datatypes can go where, and what kind of limitations you want to enable. For example, "never let me paste an SSH key into Discord".

## Thanks

-   [`grht`](https://gr.ht/) for providing feedback on this post.
