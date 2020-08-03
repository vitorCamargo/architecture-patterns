### iFood

iFood, the web application is very complete, they don't use React, but, it was possible to spy on their files becuase of their deploy, the component/page folders are chunked, but the structure is very good. It is possible to see the controllers, models, plugins and utils, also, we can say:
- They use 2 spaces (not minified);
- The files don't follow a rule to be created, some are camelCase, some not;
- They use a MVC structure pattern;
- All files have docs, and it is very easy to read and understand codes and functions;
- They create files that are used to analytics (using listeners);
- Even the files being **EcmaScript modules**, the deploy could minified and chunked the files too (their bad);