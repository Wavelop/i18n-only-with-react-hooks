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
  const { language } = useTranslateState();
  const i18n = useTranslate();
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
    <section className="LanguageSwitcher">
      <span>
        {t(`LanguageSwitcher.used`)} {t(`LanguageSwitcher.${language}`)}
      </span>
      <span>{items}</span>
    </section>
  );
}

export default LanguageSwitcher;
