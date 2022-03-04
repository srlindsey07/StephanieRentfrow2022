# Stephanie Rentfrow Personal Site
To build, run 'gulp build' in command line. To serve, run 'gulp serve'.

## How to Deploy
See this article: https://medium.com/@ayushya/move-directory-from-one-repository-to-another-preserving-git-history-d210fa049d4b

1. Clone production repository.
```
git clone <prod repo url>
```

2. Go to prod directory.
```
cd <prod repo directory>
```

3. Create remote connection from dev repo to prod repo.
```
git remote add <repo-nickname> <dev repo url>
```

4. Pull contents of dist folder from dev repo.
```
TBD
```
OR entire contents and delete unnecessary files.
```
git pull <repo-nickname> main --allow-unrelated-histories
```

5. Remove remote connection to dev repository.
```
git remote rm <repo-nickname>
```

6. Push changes to production repository.
