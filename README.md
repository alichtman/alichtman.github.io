# `alichtman`'s Blog -- Forked from Minimal Mistakes

[Minimal Mistakes Jekyll theme](https://github.com/mmistakes/minimal-mistakes).

[Configuration Notes](https://mmistakes.github.io/minimal-mistakes/docs/configuration/).

---

## Development Commands

```bash
$ bundle config set --local path 'vendor/bundle'
$ bundle install
$ bundle add webrick # https://github.com/jekyll/jekyll/issues/8523#issuecomment-751409319
$ rm .jekyll-metadata && bundle exec jekyll serve --incremental
```

## Troubleshooting

If you have a question about using Jekyll, start a discussion on the [Jekyll Forum](https://talk.jekyllrb.com/) or [StackOverflow](https://stackoverflow.com/questions/tagged/jekyll). Other resources:

-   [Ruby 101](https://jekyllrb.com/docs/ruby-101/)
-   [Setting up a Jekyll site with GitHub Pages](https://jekyllrb.com/docs/github-pages/)
-   [Configuring GitHub Metadata](https://github.com/jekyll/github-metadata/blob/master/docs/configuration.md#configuration) to work properly when developing locally and avoid `No GitHub API authentication could be found. Some fields may be missing or have incorrect data.` warnings.
