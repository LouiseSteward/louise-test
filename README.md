# CORE

The CORE Economics textbook in production with Electric Book Works.

This content is managed using the [Electric Book](http://electricbook.works) workflow. See the [EBW docs](http://electricbook.works) for how that works, and the [project docs](https://fireandlion.github.io/core/docs) for guidance on book-specific issues.

## Deployment

This core-experiments project has an unusual deploy setup. We need two versions of the site built and deployed to different folders on production, one built with a separate config.

- The default build is for instructors. On live, it should deploy to `/experiencing-economics/instructors`.
- A student build requires a student config, either `_config.students.yml` or, for live builds, `_config.students.live.yml`.

We need to set up CodeShip to watch for `release-students-` and `preview-students-` tags, in addition to `release-` and `preview-` tags:

- The `release-students-` and `preview-students-` tags trigger a build with the live students config, which deploys to `/experiments`.
- The normal `live-` and `preview-` tags trigger a normal build that deploys to `/experiments/instructors`.

This may mean adapting this repo's `test.sh` and `deploy.sh` scripts, or further developing their defaults to call a separate script that is customisable by project, e.g. `test-custom.sh` and `deploy-custom.sh`.

With the resulting baseurl and folder structure, on core-econ.org we can simply restrict access to `/experiencing-economics/instructors`, while leaving `experiencing-economics` publicly accessible.


## Usage

### Local output

To output PDF or web previews locally, run the OS-specific script: `run-linux.sh`, `run-mac.command`, or `run-windows.bat`. 

On Linux and Mac, you first need to give the script permission to run. You only need to do this once. From the terminal, in the repo's root folder, run `chmod +x ./run-linux.sh` on Linux or `chmod +x ./run-mac.command` on Mac.

#### Output student PDFs

To output student PDFs, adjust the file list in `_data/meta.yml` as usual and adjust the keep and exclude lists in `_configs/_config.students.screen-pdf.yml`. Run the OS-specific output script and when asked for additional configs use: `_configs/_config.students.screen-pdf.yml`.

### Use the Electric Book Manager

You can edit and output the book online using the [Electric Book Manager](http://manage.electricbook.works). The EBM is beta software in development.

### Build website for production (live)

To build HTML for use on [core-econ.org](http://core-econ.org):

First do the students build:

```
bundle install
bundle exec jekyll build --config="_config.yml,_configs/_config.live.yml,_configs/_config.students.live.yml"
```

After this build, place the contents of the `_site` folder in the `/experiencing-economics` folder on the live site.

Then do the instructors build and place the built HTML from the updated `_site` folder in the `/experiencing-economics/instructors` folder:

```
bundle exec jekyll build --config="_config.yml,_configs/_config.live.yml"
```

Finally, do the instructors-preview build, and place the built HTML from the `_site` folder in the `experiencing-economics/instructors-preview` folder (next to the instructors folder)

```
bundle exec jekyll build --config="_config.yml,_configs/_config.live.yml,_configs/_config.instructors-preview.yml"
```

When uploading files to a webserver via FTP, it's recommended that:

- folders have permissions set to 755
- files have permissions set to 744 or 644

#### Build a particular language only

To build one language only, the language must have a live-config file in `_configs`. E.g. for Farsi, create `_configs/_config.live.fa.yml`. That file must specify the `build-language`, e.g.

```
build-language: fa
```

Then to build, say, the Farsi version only:

1. If this version uses images that are not on `core-econ.org/the-economy`, temporarily set the `live` `remote-media` in `settings.yml` to the domain where the images will be stored, e.g.

    ```
    remote-media:
      live: "https://iranacademia.com/book/economy"
    ```

2. Then build from the terminal with:

    ```
    bundle exec jekyll serve --config="_config.yml,_configs/_config.live.fa.yml"
    ```

3. In the `the-economy-media` repo, get the images for this language. When uploading the live site via FTP, place this language's images on the server you specified for `remote-media`, in their usual directory.

### Output a PDF of images only

It can be useful to review all the images in a PDF. To get this:

1. In `_data/settings.yml`, set `slideline-review` to `true`.
2. In `_configs/config.screen-pdf.yml` comment out the line that excludes `/styles/print-pdf*`, because we need to import that stylesheet.
3. In `_data/meta.yml` set the `files` list to output only the book parts you need (e.g. generally prelims are not necessary).
4. Make sure that you have cloned and updated the remote-media repo, and that its folder is a sibling to this folder, so that we get the latest images in.
5. Use the output script to create a screen PDF.

This output is not pretty. It is functional.

### Building apps

#### Android

Use the separate [core-android-app]() repository, which has usage guidelines.

#### iOS

This is work-in-progress. On an up-to-date Mac with X-Code, run the `run-mac.command` script and use the app option.

See '[Add remote media](#add-remote-media)' below before using the script.

We're still working on the signing process, which is done in X Code.

#### Windows

You must have Visual Studio installed with all requirements for Cordova Windows APPS installed. The basic process will be:

1. Create a listing in the Windows app store. (Once-off.)
1. Check that `google-play-expansion-file` is not enabled in `settings.yml`.
1. Build app HTML with Jekyll.
2. Add the Windows app platform files with Cordova.
3. Build the app for release with Visual Studio.

Here are the detailed steps:

1. [Create a listing in the Windows app store](https://developer.microsoft.com/en-us/dashboard/). At the moment, some of the forms you need to complete only work in Edge (!). If this is already done, perhaps check that it's up to date and add any release notes.
1. Create or check that you have a `secrets.yml` file in `_data` with the `windows` `package-identity-name`, `publisher-id` and `publisher-display-name` filled in. (And remember *never* to commit secrets to version control.)
   - You get these details from the app dashboard on the [Windows site](https://partner.microsoft.com/en-us/dashboard/products/), under 'App management > App identity'. 
   - You can also get the `publisher-id` value there from your Windows developer settings.
   - If you're creating a one-language translation app, this should have a section for the language. E.g.:

      ```
      android:
        app-path-to-keystore: "path/to/keystore"
        app-keystore-password: "passwordhere"
        app-key-alias: "keyaliashere"
        app-key-password: "keypasswordhere"
      ios:
        development-team-id: "YOURTEAMID"
        package-type: "development"
      windows:
        package-certificate-key-file: ""
        package-thumbprint: ""
        package-identity-name: "FireandLion.TheEconomybyCORE"
        publisher-id: "CN=5AFD6B15-F931-4B1F-A7CA-XXXXXXXXXXXX"
      fr:
        android:
          app-path-to-keystore: "path/to/keystore"
          app-keystore-password: "passwordhere"
          app-key-alias: "keyaliashere"
          app-key-password: "keypasswordhere"
        ios:
          development-team-id: "YOURTEAMID"
          package-type: "development"
        windows:
          package-certificate-key-file: ""
          package-thumbprint: ""
          package-identity-name: "FireandLion.LconomieparCORE"
          publisher-id: "CN=5AFD6B15-F931-4B1F-A7CA-XXXXXXXXXXXX"  publisher-display-name: "Electric Book Works"
      ```

1. Ensure that `google-play-expansion-file-enabled` is not set in `_data/settings.yml` (that's only for Android).
1. Use the output script to create the app-ready HTML only. If you're creating a translation app, when the output script asks for extra config files, enter the relevant config file for that language. E.g. for French: `_configs/_config.app.fr.yml`
2. Copy the images from the remote media repo manually to `_site/app/www/book/images` (or the equivalent translation images folder; see '[Add remote media](#add-remote-media)' below for more detail).
2. At a command prompt in the repo root, run `cd _site/app && cordova platform rm windows && cordova platform add windows@6.0.0 && cordova build windows`
3. Open Visual Studio. From there, open the Cordova solution file (`.sln`) in `_site/app/platforms/windows`, and deploy and and build for your local machine to test. (You should be able to click the '► Local machine' button in the toolbar.)
4. We recommend building a Release version (not a Debug version) to test that the app works when fully signed. To do this:
    1. Associate the app with an app listing in the store. Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Associate App with the Store... (You may only have to do this once.)
    2. In the toolbar, select 'Release' instead of 'Debug'. Select your computer's architecture in the next box (usually 'x64').
    3. Under `CordovaApp.Windows10 (Universal Windows)` open `package.windows10.appxmanifest` and add the language code to the 'Default language' field. You can also correct the description, which Visual Studio or Cordova aren't getting right currently. Save the file.
    3. Click the '► Local machine' button in the toolbar. (Sometimes you get an error and have to enter the language again in the 'Default language' field. Then retry '► Local machine'.) If the process works and you're on Windows, it should install the app to your computer, where you should open and test it.
5. To prepare for the Windows store, use Visual Studio following the guidance in [this article](https://docs.microsoft.com/en-us/windows/uwp/packaging/packaging-uwp-apps). In short, you will:
    1. Use VS's Solution Explorer (a panel on the right, which you can show with View > Solution Explorer). Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Associate App with the Store... and select the correct app that appears. This will sign the app with the correct certificate. (You may only have to do this once.)
    1. However, this unsets the default language that Cordova adds to non-release builds. So under `CordovaApp.Windows10 (Universal Windows)` open `package.windows10.appxmanifest` and add the language code to the 'Default language' field. You can also correct the description, which Visual Studio or Cordova aren't getting right currently.
    1. Now create an app package upload file. Use VS's Solution Explorer (a panel on the right, which you can show with View > Solution Explorer). Right-click `CordovaApp.Windows10 (Universal Windows)` then select Store > Create App Packages.
    2. When setting the version number, we use the same version as the project version in `_data/meta.yml`, with an extra zero (e.g. if the `meta.yml` version number is `1.0.5`, our Windows app version number will be `1.0.5.0`.
    4. In the Generate app bundle listbox, select Always.
    3. Select the three architecture configurations (x86, x64, and ARM) in the Select and Configure Packages dialog. Not the Neutral option.
    5. Click Create and hold thumbs.
    6. Validate your app before you submit it to Dev Center. To validate, leave the Local machine option selected and click Launch Windows App Certification Kit.

6. Run the app locally to check that it works. If you're debugging, if your WACK reports show failures, the event logs are in `C:\ProgramData\Microsoft\Windows\WER\ReportArchive`.
7. Visual Studio saves the `.appxupload` file is in `core\_site\app\platforms\windows\AppPackages`. Remember to save the `appxupload` generated to Dropbox for backup. Upload it to the Dev Center.

##### Troubleshooting

- Sometimes, when you build a release, you get a white screen when opening the app or any page inside it. [This post explains a likely reason](https://stackoverflow.com/questions/39200592/visual-studio-2015-cordova-windows-10-blank-white-screen-after-associated-with), which is that Visual Studio has changed the Package Name based on what's in your Windows account, and it doesn't match what you have in your app. To get it right, `WindowsStoreIdentityName` and `WindowsStorePublisherName` must be correct in the output `config.xml`, which is populated from what you have in `_data/secrets.yml`.
- Another possible reason for the white screen of doom is that Cordova is not setting the default language in `package.windows10.appxmanifest`, which is is supposed to read from `config.xml`. This seems to be because when associating the app with the store, Visual Studio unsets teh default language. To fix this manually, open `package.windows10.appxmanifest` in Visual Studio and add the language code to 'Default language'.

#### Add remote media

This project uses remote-media, storing images in a separate project. For the iOS and Windows apps, you need to:

1. Generate the app HTML using the output script.
2. Manually copy `the-economy-media/book/images/app` from the `the-economy-media` repo to `_site/app/www/book/images`. If you're building a translation, this should be the equivalent translation images folder, e.g. copy `the-economy-media/book/fr/images/app` to `_site/app/www/book/fr/images` for French.  
3. Build the app with Cordova.

### Epub output

With most EB projects, you set up the epub information in `_data/meta.yml` once, and then use the epub option in the output script to generate an epub.

The difference in this project is that we use a separate media repo for images. So there is an extra step: before using the output script, manually copy the epub images from the media repo to `book/images/epub/`. The files must be here when Jekyll builds the site, so that every image can be processed by Jekyll and added to the OPF manifest for the epub.

### Image resizing, JavaScript linting and minifying

We use the task runner [Gulp](https://gulpjs.com/) for these tasks. The CORE projects use high-res files in `images/print-pdf`[^1] as the source files, and Gulp converts these into versions optimised for other output formats.

[^1]: Note that this is different from later versions of the Electric Book template, which use the `_source` folder for master images.

So you can run:

- `gulp` to generate smaller, optimised, version of the images in the `book/images/print-pdf` directory and automatically put them into the `book/images/web`, `book/images/screen-pdf`, and `book/images/epub` directories;
- `gulp js` to lint (using `eslint.json`) and minify the JavaScript. Alternatively, run `gulp watch` to watch the JavaScript files for changes and run `gulp js` when they do.

First, we need to install Gulp, NodeJS (which Gulp requires), and [GraphicsMagick](http://www.graphicsmagick.org/) (which we need behind the scenes for the image resizing).

#### Install Node

Head to [nodejs.org](https://nodejs.org/en/) and download and install the latest version. If you're using MacOS, it's best to use [Homebrew](https://brew.sh/) to do this (by running `brew update` then `brew install node`).

#### Install Gulp and our dependencies

From the terminal / command line run `npm install gulp-cli -g` to install gulp. This installs gulp on your system.

Once that's finished run `npm install` to install the dependencies we need, listed in `package.json`.

#### Install GraphicsMagick

Head to [the download section of graphicsmagick.org](http://www.graphicsmagick.org/download.html#download-sites) and download and install GraphicsMagick for your system. Use the Q16 version for best results with colour conversions.
