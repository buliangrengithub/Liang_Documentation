# sh npm run deploy

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd public

# 如果是发布到自定义域名
echo 'blog.zlhyve.com/' > CNAME


git init
git config user.name "caijiu"
git config user.email "1784752000@qq.com"
git add -A
git commit -m 'deploy-coding'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@dadifeihong:dadifeihong/dadifeihong.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# git@e.coding.net:caijiu/blog/blog.git
git push -f git@zl:caijiu/blog/blog.git master
cd -