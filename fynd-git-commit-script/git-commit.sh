#!/bin/bash

addall=''
docommit=''
emptycommit=''
dopush=''
dodeploy=''

# Regular Colors
Color_Off='\033[0m'
Black='\033[0;30m'  # Black
Red='\033[0;31m'    # Red
Green='\033[0;32m'  # Green
Yellow='\033[0;33m' # Yellow
Blue='\033[0;34m'   # Blue
Purple='\033[0;35m' # Purple
Cyan='\033[0;36m'   # Cyan
White='\033[0;37m'  # White

currentBranch=$(git branch --show-current)
echo "Current branch is: $Green $currentBranch $Color_Off"

echo "$Green"
echo
lastCommitMessage=$(git log --oneline | cat | head -3)
echo "Last commit message: $lastCommitMessage $Color_Off"

# detect Jira ID from branch name
if [[ $currentBranch =~ ([A-Z][A-Z0-9]+-[0-9]+) ]]; then
  jiraId=${BASH_REMATCH[1]}
  echo "$Green"
  echo "ID (automatically detected) : $jiraId $Color_Off"

  echo "$Red"
  read -p "Press ENTER key to continue with this ID ( any other key to edit) : " -r -s -n 1 key # -s: do not echo input character. -n 1: read only 1 character (separate with space)
  echo "$Color_Off"

  if [[ $key = "" ]]; then
    echo "$Green ID $jiraId saved. $Color_Off"
  else
    read -p "Jira Link/Tracker ID: " jiraString
    if [[ $jiraString =~ ([A-Z][A-Z0-9]+-[0-9]+) ]]; then
      jiraId=${BASH_REMATCH[1]}
      echo "$Green"
      echo "ID : $jiraId $Color_Off"
    fi
  fi

else

  echo "$Red Tracker ID could NOT be detected from branch name: '$currentBranch' $Color_Off" >&2
  read -p "Jira Link/Tracker ID: " jiraString
  if [[ $jiraString =~ ([A-Z][A-Z0-9]+-[0-9]+) ]]; then
    jiraId=${BASH_REMATCH[1]}
    echo "$Green"
    echo "ID : $jiraId $Color_Off"
  fi
fi

read -p "Hours Involved : " hours
read -p "DONE (%) : " donePerc
read -p "Commit message : " commitMessage
commitMessage="ID: $jiraId; HOURS: $hours; DONE: $donePerc; $commitMessage"

echo "$Yellow"
echo "$commitMessage "
echo "$Color_Off"

echo "$Red"
read -p "Press ENTER key to continue for next operations? (add/commit/push/deploy as given in flags) : " -r -s -n 1 goahead # -s: do not echo input character. -n 1: read only 1 character (separate with space)
echo "$Color_Off"

if [[ $goahead = "" ]]; then
  while getopts acped: flag; do
    case "${flag}" in
    a) addall='true' ;;
    c) docommit='true' ;;
    e) emptycommit='true' ;;
    p) dopush='true' ;;
    d) dodeploy=${OPTARG} ;;
    esac
  done

  if [ "$addall" = "true" ]; then
    echo "executing > git add ."
    git add .
  fi

  if [ "$docommit" = "true" ]; then
    echo "executing > git commit -m \"$commitMessage\""
    git commit -m "$commitMessage"
  fi

  if [ "$emptycommit" = "true" ]; then
    echo "executing > git commit --allow-empty -m \"$commitMessage\""
    git commit --allow-empty -m "$commitMessage"
  fi

  if [ "$dopush" = "true" ]; then
    echo "executing > git push"
    git push
  fi

  if [ "$dodeploy" = "x2" ]; then
    echo "Deploying in x2 env"
    TAG=deploy.jmpx2.$(date +%s)
    echo "Deploying $TAG"
    git tag $TAG -f
    git push origin $TAG -f
  fi

  if [ "$dodeploy" = "x3" ]; then
    echo "Deploying in x3 env"
    TAG=deploy.jmpx3.$(date +%s)
    echo "Deploying $TAG"
    git tag $TAG -f
    git push origin $TAG -f
  fi
else
  echo "Terminating process ..."
  echo "Terminated"
fi
