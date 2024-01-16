rm -fr test-repo
mkdir test-repo
git clone git@github.com:CodeVachon/CodeVachon.git test-repo
cd test-repo
git checkout -b test
git checkout main
git checkout -b banana
git checkout -b production
git checkout main
git checkout -b staging-patch
git checkout -b staging-release
git checkout -b Release-0.1.0
git checkout -b Patch-v0.1.1
git checkout -b Patch-v0.1.2
git checkout -b Release-0.2.0
