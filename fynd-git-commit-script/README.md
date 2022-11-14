
# Fynd Git Commit Script

This tiny script makes it easier (in a way) to commit code as per Fynd guidelines. 

## How it helps?

Documentation
  - Fetches the Jira Tracker ID from the git branch name ( if you're maintaining ticket wise branches, this can be useful )
  - Prompts the user to enter details such as HOURS, DONE %, MESSAGE
  - As per flags, it executes the operations ( please see Usage/Examples )




## Run Locally

Clone the project

```bash
  git clone https://github.com/maulik-fynd/fynd-tiny-tools.git
```

Go to the project directory

```bash
  cd fynd-git-commit-script
```

Install dependencies

```bash
  sh git-commit.sh
```
## Usage/Examples

```bash

# git add
sh git-commit.sh -a

# git commit 
sh git-commit.sh -c

# git empty commit (to push trigger for deployment) 
sh git-commit.sh -e

# git push
sh git-commit.sh -p

# git deploy
sh git-commit.sh -d x2
sh git-commit.sh -d x3

All at once
sh git-commit.sh -acpd x2

```


## Contributing

We welcome the suggestions and feedback on Slack.

