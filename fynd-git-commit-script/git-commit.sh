#!/bin/bash
print_usage() {
  printf "a  >  git add . "
  printf "c  >  git commit -m ..."
  printf "p  >  git push"
  printf "e  >  git commit --allow-empty -m"
}

addall=''
docommit=''
emptycommit=''
dopush=''

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

if [[ $currentBranch =~ ([A-Z][A-Z0-9]+-[0-9]+) ]]; then
  jiraId=${BASH_REMATCH[1]}
  echo "$Green"
  echo "ID (automatically detected) : $jiraId $Color_Off"

  while true; do
    read -p "Do you wish to change ID? (yn) " yn
    case $yn in
    [Yy]*)
      read -p "Jira Link/Tracker ID: " jiraString
      if [[ $jiraString =~ ([A-Z][A-Z0-9]+-[0-9]+) ]]; then
        jiraId=${BASH_REMATCH[1]}
        echo "$Green"
        echo "ID : $jiraId $Color_Off"
      fi
      break
      ;;
    [Nn]*) break ;;
    *) echo "Please answer yes or no." ;;
    esac
  done
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

echo $commitMessage

while getopts acpe flag; do
  case "${flag}" in
  a) addall='true' ;;
  c) docommit='true' ;;
  e) emptycommit='true' ;;
  p) dopush='true' ;;
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
