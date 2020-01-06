import React from "react";
import { Logo as logo } from "Assets";
import "./style.css";
import { useTranslate } from "Translate";
import { LanguageSwitcher } from "Components";

function HelloWorld() {
  const i18n = useTranslate();
  const { t } = i18n;

  return (
    <span>
      <header>
        <img src={logo} className="HelloWorld-logo" alt="logo" />
        <span>
          <h1>{t("Application.title")}</h1>
          <h2>{t("Application.subTitle")}</h2>
        </span>
      </header>

      <main>
        <LanguageSwitcher></LanguageSwitcher>
      </main>

      <footer>{t("Application.footer")}</footer>
    </span>
  );
}

export default HelloWorld;
