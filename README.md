## Deployment to Vercel

1. Log in to Vercel and go to the [project creation page](https://vercel.com/new) and select `Continue with GitHub`.

2. Find your frontend repository you just created and click `Import`. For the `Framework Preset`, choose `Vue.js`. In the `Build and Output Settings` section, toggle the override switch for `Output Directory` and set it to `client/dist`. In the `Environment Variables` section, add an entry where `NAME` is `MONGO_SRV` and `VALUE` is your [MongoDB secret](https://github.com/61040-fa22/fritter-backend#mongodb-atlas-setup).

3. Click `Deploy` and you will get a link like `https://fritter-starter-abcd.vercel.app/` where you can access your site.

Vercel will automatically deploy the latest version of your code whenever a push is made to the `main` branch.
