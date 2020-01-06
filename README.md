# i18n internalization with only React hooks - translate

In this article, we are going to explain how to set up a translation/i18n internalization system with only React hooks. 
The first article of the series _How To Implement a Translation System Without Any Library_ was about **React Native** and can be read [here](https://wavelop.com/en/story/implementing-multi-language-without-any-library-in-react-native/).

You can find the code of this tutorial [here](https://wavelop.com/en/story/i18n-only-with-react-hooks/).
You can take a look at a demo [here](https://wavelop-i18n-react-hooks.firebaseapp.com/).

> Keep in mind to adapt the code to your best practice and code styling.

## Environment setup 

Execute the following commands:

```
npx create-react-app i18n-only-with-react-hooks
cd i18n-only-with-react-hooks
npm run eject
```

To the below question say yes:

```
? Are you sure you want to eject? This action is permanent. 
````

You will have the following structure: 

```
i18n-only-with-react-hooks
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── config
│   ├── webpack.config.js
│   ├── ...
│   └── Other folder and files
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── serviceWorker.js
    └── setupTests.js
```

Execute then: 

```
npm i
```

Create the following folders inside the **src**one: 
- **assets**;
- **components**;
- **screens**;
- **translate**.

and inside of all of these folders, create an **index.js** file. Inside of every index.js file we are going to export the contained sub-folders. The sintax that we are going to use will be:

```javascript
export { default as CompontentName/ServiceName/etc } from "./CompontentNameFolder/ServiceNameFolder/etc";
```

Add to **config/webpack.config.js** file - in particular in the **resolve.alias** path of the return object - the following lines: 
```javascript
'Assets': path.resolve(__dirname, '../src/assets/'), 
'Components': path.resolve(__dirname, '../src/components/'),
'Screens': path.resolve(__dirname, '../src/screens/'),
'Translate': path.resolve(__dirname, '../src/translate/'),
```

in this way we are able to do inside every component: 

```javascript
import { CompontentName } from 'Components';
import { ServiceName } from 'Services';
...
```

and also the export for the internalization - the **Translate** module. If you prefer you can continue to use the relative path instead. The logic is the same. 

Now we are going to re-organize the file generated by the `npm run eject` command. 

Starting from the **assets** folder, we move **logo.svg** inside a new **images** folder. And inside the index file, we export the file: 

```
export { default as Logo } from './images/logo.svg';
```

Now, for components, we move the **App.css**, **App.js** and **App.test.js** inside a new folder called **App**. Then we rename them into **style.css**, **index.js** and **index.test.js**. 
Inside the new **App/index.js** file we update:
- the import line `import './App.css';` in `import './style.css';`;
- the import line `import logo from './logo.svg';`in `import { Logo as logo } from 'Assets';`.

In the end we need to update the entry point index file as the following: 

`src/index.js:` 
```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "Components";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

```

## Translate service

Now we are going to create the Translate module with all the functions necessary to translate our application. 

The main functionality of React hooks used are: 
- **createContext**;
- **useContext**; 
- **useReducer**.

Inside the **translate** folder, we create two new sub-folder: 
- **Languages**;
- **Translate**.

### Languages

The new **Languages** folder will contain the **JSON** files with all the label translated:

```json
// src/translate/Languages/en.json 

{
  "Application.title": "Wavelop",
  "Application.subTitle": "i18n internalization with only React hooks - translate",

  "Application.footer": "Developed by Wavelop",

  "LanguageSwitcher.used": "Lang selected:",
  "LanguageSwitcher.it": "Italiano",
  "LanguageSwitcher.en": "English",
  "LanguageSwitcher.fr": "Français"
}
```

```json
// src/translate/Languages/it.json

{
  "Application.title": "Wavelop",
  "Application.subTitle": "i18n internalizzazione with only React hooks - traduzioni",

  "Application.footer": "Sviluppato da Wavelop",
  "LanguageSwitcher.used": "Lingua selezionata: "
}
```

```json
// src/translate/Languages/fr.json 

{
  "Application.title": "Wavelop (French translation)",
  "Application.subTitle": "i18n internalization with only React hooks - translate (French translation)",

  "Application.footer": "Developed by Wavelop (French translation)",
  "LanguageSwitcher.used": "Lang selected: (French translation) "
}
```

As you can see, there are some missing labels in the italian and french translations. This because there will be the fallback system for the missing one. 

### Translate

The new **Translate** folder will contain the util function used by the service for the translation. The file will look like this:

```javascript
// src/translate/Translate/index.js

let _currentLanguage = "";
let _fallbackLanguage = "";
let _languages = [];
let _translations = {};

export const getCurrentLanguage = () => {
  return _currentLanguage;
};

export const setCurrentLanguage = currentLanguage => {
  _currentLanguage = currentLanguage;
};

export const getFallbackLanguage = () => {
  return _fallbackLanguage;
};

export const setFallbackLanguage = fallbackLanguage => {
  _fallbackLanguage = fallbackLanguage;
};

export const getLanguages = () => {
  return _languages;
};

export const setLanguages = languages => {
  _languages = languages;

  _languages.forEach(language => {
    const loadedLanguage = require(`../Languages/${language}.json`);
    _translations[language] = loadedLanguage;
  });
};

export const getTranslations = () => {
  return _translations;
};

export const setTranslations = translations => {
  _translations = translations;
};

export const t = label => {
  return _translations[_currentLanguage] &&
    _translations[_currentLanguage][label]
    ? _translations[_currentLanguage][label]
    : _translations[_fallbackLanguage] &&
      _translations[_fallbackLanguage][label]
    ? _translations[_fallbackLanguage][label]
    : label;
};
```

### The Hooks integration

Using the combinantion of **createContext**,**useContext** and **useReducer** we can create a system that will update the entire application updating the label too. 

```javascript
// src/translate/index.js

import React, { createContext, useContext, useReducer } from "react";

import {
  getCurrentLanguage,
  setCurrentLanguage,
  getFallbackLanguage,
  setFallbackLanguage,
  getLanguages,
  setLanguages,
  getTranslations,
  setTranslations,
  t
} from "./Translate";

// Configuration
const { language, fallBacklanguage, languages } = {
  language: "en",
  fallBacklanguage: "en",
  languages: ["it", "fr", "en"]
};

// Init language properties

setCurrentLanguage(language);
setFallbackLanguage(fallBacklanguage);
setLanguages(languages);

// Contexts
const TranslateContext = createContext();
const TranslateStateContext = createContext();
const TranslateDispatchContext = createContext();

// Reducers
function translateReducer(state, action) {
  switch (action.type) {
    case "CHANGE_LANGUAGE": {
      setCurrentLanguage(action.language);
      return { ...state, language: action.language };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Initial state
const initialState = {
  language
};

export const TranslateProvider = props => {
  const value = {
    getCurrentLanguage: props.getCurrentLanguage || getCurrentLanguage,
    setCurrentLanguage: props.setCurrentLanguage || setCurrentLanguage,
    getFallbackLanguage: props.getFallbackLanguage || getFallbackLanguage,
    setFallbackLanguage: props.setFallbackLanguage || setFallbackLanguage,
    getLanguages: props.getLanguages || getLanguages,
    setLanguages: props.setLanguages || setLanguages,
    getTranslations: props.getTranslations || getTranslations,
    setTranslations: props.setTranslations || setTranslations,
    t: props.t || t
  };
  const [state, dispatch] = useReducer(translateReducer, initialState);

  return (
    <TranslateContext.Provider value={value}>
      <TranslateStateContext.Provider value={state}>
        <TranslateDispatchContext.Provider value={dispatch}>
          {props.children}
        </TranslateDispatchContext.Provider>
      </TranslateStateContext.Provider>
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => {
  // You can use the function of provider
  const context = useContext(TranslateContext);
  if (context === undefined) {
    throw new Error("useTranslate must be used within a TranslateProvider");
  }
  return context;
};

export const useTranslateState = () => {
  const context = useContext(TranslateStateContext);
  if (context === undefined) {
    throw new Error("useTranslateState must be used within a TranslateProvider");
  }
  return context;
};

export const useTranslateDispatch = () => {
  const context = useContext(TranslateDispatchContext);
  if (context === undefined) {
    throw new Error("useTranslateDispatch must be used within a TranslateProvider");
  }
  return context;
};

```

We create three contexts to inject in the whole application the **utils functions**, the **state** object and the **dispatch** function. The **state** object exposes the current language and the **dispatch** the way to switch language. The utils functions will be used for different purposes, the main one to get the translations. 

## SwitchLanguage components 

To create a simple experience for switching between languages, we are going to create a component to do this. We create a new folder inside **components** one called **LanguageSwitcher**. Inside the new folder, we create two new files - **index.js** and **style.js**: 

```javascript
// src/components/LanguageSwitcher/index.js

// NPM dependencies
import React from "react";

// Application dependencies
import {
  useTranslate,
  useTranslateDispatch,
  useTranslateState
} from "Translate";
import "./style.css";

function LanguageSwitcher() {
  const { language } = useTranslateState(); // we get the current language
  const i18n = useTranslate(); // we get the utils functions
  const { t, getLanguages } = i18n;
  const dispatch = useTranslateDispatch();

  const items = getLanguages().map(key => {
    return key !== language ? (
      <button
        key={key}
        onClick={() => {
          dispatch({ type: "CHANGE_LANGUAGE", language: key });
        }}
      >
        {t(`LanguageSwitcher.${key}`)}
      </button>
    ) : (
      ""
    );
  });

  return (
    <section>
      <span>{t(`LanguageSwitcher.used`)}  {t(`LanguageSwitcher.${language}`)}</span>
      <span>{items}</span>
    </section>
  );
}

export default LanguageSwitcher;

```

We can leave empty the **src/components/LanguageSwitcher/style.js** file.  

Least, we add to **src/components/index.js** the following line: 
```
export { default as LanguageSwitcher } from "./LanguageSwitcher";
```

## Link all together thanks to the TranslateProvider

We need now a screen to show. We create a **HelloWorld** screen - that is a component. We create a new folder inside **screens** called **HelloWorld**. Inside the new sub-folder, we create two new files - **index.js** and **style.js**: 

```javascript
// src/screens/HelloWorld/index.js

import React from "react";
import { Logo as logo } from "Assets";
import "./style.css";
import { useTranslate } from "Translate";
import { LanguageSwitcher } from "Components";

function HelloWorld() {

  const i18n = useTranslate();
  const { t } = i18n;

  return (
      <span className="HelloWorld">
        <header>
          <h1>{t("Application.title")}</h1>
          <h2>{t("Application.subTitle")}</h2>
          <img src={logo} className="HelloWorld-logo" alt="logo" />
        </header>
        <main>
          <LanguageSwitcher></LanguageSwitcher>
        </main>

        <footer>{t("Application.footer")}</footer>
      </span>
  );
}

export default HelloWorld;
```

We can leave empty the **src/screens/HelloWorld/style.js** file.  

Least, we add to **src/screens/index.js** the following line: 
```javascript
export {default as HelloWorld} from './HelloWorld';
```

At this point, we go back to **src/components/App/index.js** file and we update it in this way:

```javascript
// src/components/App/index.js

import React from "react";
import "./style.css";
import { TranslateProvider } from "Translate";
import { HelloWorld } from "Screens";

function App() {
  return (
    <TranslateProvider>
      <HelloWorld />
    </TranslateProvider>
  );
}

export default App;
```

The style for the **App** component is no more necessary, we can delete all the content of **style.js**. 

Final project structure: 

```
i18n-only-with-react-hooks
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── config
│   ├── webpack.config.js
│   ├── ...
│   └── Other folder and files
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── index.css
    ├── index.js
    ├── serviceWorker.js
    ├── setupTests.js
    ├── assets
    │   ├── images
    |   │   └── logo.svg   
    │   └── index.js
    ├── components
    │   ├── App
    |   │   ├── index.js   
    |   │   └── style.css   
    │   ├── LanguageSwitcher
    |   │   ├── index.js   
    |   │   └── style.css  
    │   └── index.js  
    ├── screens
    │   ├── HelloWorld
    |   │   ├── index.js   
    |   │   └── style.css  
    │   └── index.js
    └── translate
        ├── Languages
        │   ├── en.json  
        │   ├── fr.json   
        │   └── it.json  
        ├── Translate
        │   └── index.js  
        └── index.js
```

Now everything is working, execute `npm run start` and go to [localhost:3000](http://localhost:3000) to test it. 

![Demo](20200106_test_1.gif)

# Reference 

* https://reactjs.org/docs/hooks-intro.html
* https://medium.com/the-guild/injectable-services-in-react-de0136b6d476
* https://spectrum.chat/react/help/how-do-i-combine-reducers-while-managing-state-with-usereducer-hook-context~842dbecd-bde0-475f-87b2-3e9ecc7bf713
* https://kentcdodds.com/blog/how-to-use-react-context-effectively

# Conclusion

With the combination of the React Hooks API is easy to create an i18n translate system for your site or application. 

This tutorial is part of the series _How To Implement a Translation System Without Any Library_ and the first article was about **React Native** and can be read [here](https://wavelop.com/en/story/implementing-multi-language-without-any-library-in-react-native/).

You can find the code of this tutorial [here](https://wavelop.com/en/story/i18n-only-with-react-hooks/).
You can take a look at a demo [here](https://wavelop-i18n-react-hooks.firebaseapp.com/).

If you have questions, please write to us on the chat or an email to [info@wavelop.com](mailto:info@wavelop.com).