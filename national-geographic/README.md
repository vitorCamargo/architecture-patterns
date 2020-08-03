## National Geographic

Yeah, this amazing is made using React, the `./src` folder shows a little part of their project structure, I can say, looking their coding some points:
- Their deploy are uselful in terms of getting just what you need to load something, because of that, the site is very light and fast to load resources, but, their webpack was not very well design, just accessing thier home page I had access to some utils files, if I grant some permissions, maybe I will have more informations to get more chance to enter in their complete code;
- They don't use a very specific structure pattern, BUT, all the resources used from the browser are classes' instances in the System. **Look `./src/local_storage_handler.js` (this type of data structure are very great for optmize data management);
- 2 spaces (no minification);
- The utils files are a mixin of native javascript functions and classes. (If you create a better way to make automatizated deploy of those files, you can padronize all them to classes ['cause it is better to rewrite/edit some files after a while]);