import {Route, Routes} from "react-router-dom";
import LoginForm from "../../pages/LoginForm/LoginForm";
import Header from "../../pages/Index/Header";
import Home from "../../pages/Home/Home";
import Log from "../../pages/Log/Log";
import { useState} from "react";
import {I18nextProvider,  withTranslation} from "react-i18next";
import React from 'react'
const App=({ i18n}:{i18n:any}) =>{
    const [theme,setTheme]=useState(localStorage.getItem("theme")?localStorage.getItem("theme"):"light");
    return (
        <I18nextProvider i18n={i18n}>
        <div>
            <link rel={"stylesheet"} type={"text/css"} href={`./static/css/${theme}.css`} />
            <Header setTheme={setTheme} theme={theme} />
            <Routes>
                <Route  path='/login' element={< LoginForm />}></Route>
                <Route  path='/todo_list' element={< Home />}></Route>
                <Route  path='/log' element={< Log />}></Route>
            </Routes>
        </div>
        </I18nextProvider>
    );
}

export default withTranslation('translation')(App);
