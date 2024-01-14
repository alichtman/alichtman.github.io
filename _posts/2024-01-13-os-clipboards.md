---
title: "Sane Behavior for OS Clipboards (and a bit about command line tools)"
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

# Where does it hurt?

![where does it hurt](/assets/images/where-does-it-hurt-clipboard.jpg){: .align-center}

I expect system clipboards to do **one thing -- store text and let me paste it later**. If you're counting along and got two things, you are _off-by-one_. This is one of the [two hard problems in CS](https://martinfowler.com/bliki/TwoHardThings.html).

For reasons I will never understand, the default `macOS` and `linux` clipboards hold a max of one (1) item.

## Here's an example

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

You open VS Code (we'll ignore `vim` workflows for this example, since they can make changing file focus less of a big deal by not requiring your hands to come off the keyboard), and split the screen vertically: `File 1` on the left, `File 2` on the right.

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

You can perform the above task in `vim` without ever taking your hands off the keyboard. You'll ~~break things~~ **build stable infra** faster by learning CLI / modal-editing workflows (and obsessing over [`nvim` and `tmux` configs](https://github.com/alichtman/dotfiles)).
{: .notice--info}

![break things faster](/assets/images/move-fast.webp){: .align-center}

> Image attributed to Facebook [here](https://medium.com/swlh/move-fast-and-break-things-is-not-dead-8260b0718d90)

Although, what limits me is definitely not the speed at which I can operate my computer. If only it were as straightforward to type _better things_ as it is to _type things faster_. :)

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

Registers are awesome for working _inside_ of `vim` but aren't exposed _outside_ of `vim`. This means we can't use them as the clipboard manager, even though they roughly have the behavior I'm looking for. Here's a peek at what's currently in my `vim` registers while I'm working on this article:

![vim registers](/assets/images/vim-registers.png){: .align-center}

There are two special registers for the system clipboard, called [selection registers](https://learnvim.irian.to/basics/registers#the-selection-registers). If you want to copy text from inside `vim` and paste it outside of `vim`, you need to copy to them explicitly (`"+y`). For more reasons I will never understand, copying to the system clipboard isn't the default copy behavior.

[Tell `vim` to copy to the system clipboard by default](https://vim.fandom.com/wiki/Accessing_the_system_clipboard) by adding the following setting in your `init.lua` file:

```lua
vim.opt.clipboard = "unnamedplus"
````

After doing that, the workflow becomes:

```
# Open the first file
$ vim file1.txt
g'/home/alichtman/Pictures/Screenshots/Screenshot from 2024-01-14 07-58-24.png' g0

# Copy line to system clipboard
yy
2j
yy
:vs file2.txt
Ctrl-w l
" Paste from system clipboard register
p

# Open the clipboard manager -- read the next section!
Shift-Alt-Super-V

# Set the clipboard to the second-to-last item in the clipboard history
Down Arrow

# Paste from clipboard
p
:wq
```

### `tmux`

To make `tmux` and the system clipboard play nicely together, I use [`tmux-yank`](https://github.com/tmux-plugins/tmux-yank) in my [`tmux.conf`](https://github.com/alichtman/dotfiles/blob/main/.config/tmux/tmux.conf#L197).


## Clipboard Manager Setup

I primarily work on `macOS` and `Linux` machines, and have a clipboard manager workflow for each.

### Requirements

- Extended clipboard history storage
- Easily browsable / searchable clipboard history
- Support for media (images / videos) in the clipboard
    - Previewing the media is not required, but is a nice-to-have
- Same keychord for the clipboard manager on all OSes
    - One which wasn't a common keybinding in other tools I use

### Keychord Configuration

I set the `macOS` keychord to `Shift+Cmd+Option+V` and the Linux keychord to `Shift+Alt+Super+V`.

You might be saying to yourself: _"Those are definitely different keychords, man"_. I use a [Razer Chroma Ornata](https://www.amazon.com/Razer-Ornata-Gaming-Keyboard-Spill-Resistant/dp/B09X6FKCBD) keyboard for my Linux machine, and the built-in Apple Keyboard for my macOS machine. The keychords are identical in terms of where the keys are on the keyboards, which is what's really important here.

### Ubuntu Linux (with GNOME)

I use [`greenclip`](https://github.com/erebe/greenclip) integrated with [`rofi`](https://github.com/davatorium/rofi) to manage my clipboard history. Note that it does not provide media previews. If that's a critical feature set, check out [Pano](https://github.com/oae/gnome-shell-pano).

![greenclip](/assets/images/rofi-greenclip.jpg){: .align-center}

Using GNOME Keyboard Custom Shortcuts, I map `rofi -modi 'clipboard:~/bin/greenclip print' -show clipboard` to the keychord I mentioned above.

![gnome keyboard shortcuts](/assets/images/gnome-clipboard-shortcut.png){: .align-center}

### macOS

I install [`Maccy`](https://github.com/p0deje/Maccy) with `brew`. It looks like a native macOS app, is free and open-source, and is intuitive to use.
{% capture fig_img %}
![maccy](/assets/images/maccy.png){: .align-center}
{% endcapture %}

{% capture fig_caption %}
It leaves you wondering: Why doesn't Apple ship this experience by default?
{% endcapture %}

<figure>
  {{ fig_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>{{ fig_caption | markdownify | remove: "<p>" | remove: "</p>" }}</figcaption>
</figure>



`macOS` has a reputation for **Just Working™**.

The clipboard manager **does NOT Just Work™**.
{: style="text-align: right;"}

---

Interesting note: `Cut / Copy / Paste` was  [invented by Larry Tesler](http://worrydream.com/refs/Tesler%20-%20A%20Personal%20History%20of%20Modeless%20Text%20Editing%20and%20Cut-Copy-Paste.pdf) in the 70s. Tessler became the systems software lead for the Apple Lisa, and eventually Apple's chief scientist in 1993.


### Windows

Surprisingly, `Windows` seems to be the only OS that gets this right. The default clipboard manager has a built-in clipboard history. But the default file manager (in **2024!!!**) still reports all file sizes in `KB`, so rest assured that there is plenty left to complain about.


## Sane Defaults

It's _great_ that I can make this all work. But it's kind of ridiculous that I need to configure it myself. I consider these features to be **basic functionality** that should be configured by default.

Jeff Atwood (Stack Overflow co-founder) had similar things to say about the Windows Vista introduction of [typing to search for files, executables, emails, etc in the Start Menu](https://blog.codinghorror.com/typing-trumps-pointing/):

> ... with Vista, typing to navigate is now quite literally the cornerstone of the operating system. I've gone from tedious, manually defined hotkeys and shortcuts in Windows XP to simply typing what I want and letting the computer find it for me. It also utterly obsoletes the Start, Run menu because it works for file paths.
>
>
>
> There are dozens of third-party solutions that deliver very similar interactive full-text search UI experiences. But **there's one key difference between those solutions and the one in Vista: I have to install them**. You may argue that, in the near term, I also have to install Vista. Fair enough. But over the next five years, millions of users will buy computers with Vista pre-installed. And they'll immediately benefit from the built-in, default full-text search UI that's accessible right out of the box with a single press of the Windows key.

[<cite>Jeff Atwood</cite> --- **"The Power of Defaults"**](https://blog.codinghorror.com/the-power-of-defaults/), 2007
{: .small}

I wish macOS and GNOME provided these clipboard manager features by default -- _batteries included_. More people would use them, and the effort to figure out how to nicely build and integrate these features wouldn't be duplicated by me and other engineers.

#### Thanks
- [`grht`](https://gr.ht/) for providing feedback on this post.
