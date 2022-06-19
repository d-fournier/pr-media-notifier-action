[![build-test](https://github.com/d-fournier/pr-media-notifier-action/actions/workflows/test.yml/badge.svg)](https://github.com/d-fournier/pr-media-notifier-action/actions/workflows/test.yml)

# PR Media notifier
This action allows you to share easily the medias you added in your PR description on a Slack channel.

When developing, especially but not only UI, you usually want to share the result of your work in the PR so that the reviewers can easily understand your change. Github allow images, videos, GIF.
Media is also a great way to get feedbacks from your team before your code is merged, while your hands are still dirty.
But all your team does not have access to Github or your repository.

This action will scan your PRs to find all the medias that you included in the description and forward them into a slack channel. That way, your coworkers can react, comment and cheer.

## Inputs

| name          | required | type   | default         | description |
| ------------- | ---      | ------ | --------------- | ----------- |
| slack-webhook | yes      | string |                 | URL of the Slack webhook, linked to the channel you want, usually starting by `https://hooks.slack.com/services`
| github-token  | yes      | string |                 | Token to interact with the current repository. This token is usually already in the environment variables ${{ secrets.GITHUB_TOKEN }}.

## Example usage

This workflow will send a message for all PR created.

```yml
name: 'share-medias'
on:
  pull_request:
    types: [opened, edited, reopened]

  share:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ./
        with:
          slack-token: ${{ secrets.SLACK_APP_KEY }}
          slack-channel: ${{ secrets.SLACK_CHANNEL_ID }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

You can restrict the execution of this job for specific tags using `run-if` conditions.
