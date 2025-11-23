# `alichtman`'s Blog -- Forked from Minimal Mistakes

[Minimal Mistakes Jekyll theme](https://github.com/mmistakes/minimal-mistakes).

[Configuration Notes](https://mmistakes.github.io/minimal-mistakes/docs/configuration/).

---

## Development Commands

### Docker (Recommended)

Start the development environment with Docker Compose:
```bash
docker-compose up
```

The site will be available at `http://localhost:4000` with live reload enabled.

**Services:**
- **Jekyll**: Runs Jekyll with live reload and drafts enabled (ports 4000 and 35729)
- **Node**: Watches and builds JavaScript assets automatically

**Common commands:**
```bash
# Start services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after dependency changes
docker-compose down && docker-compose up --build

# Run bundle commands
docker-compose exec jekyll bundle update

# Clean up everything (including volumes)
docker-compose down -v
```

### Local Development (Without Docker)

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
