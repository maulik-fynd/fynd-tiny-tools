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

currentBranch=$(git branch --show-current)
echo "Current branch is: \033[1;31m $currentBranch \033[0m"
read -p "Jira/Tracker ID : " jiraId
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
  git commit -m \"$commitMessage\"
fi

if [ "$emptycommit" = "true" ]; then
  echo "executing > git commit --allow-empty -m \"$commitMessage\""
  git commit --allow-empty -m \"$commitMessage\"
fi

if [ "$dopush" = "true" ]; then
  echo "executing > git push"
  git push
fi
