import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
// 引入最新版本globalProperties文件则可以直接用下面这个方法
// let env = globalProperties.getCurrentEnv();

function getCurrentEnv() {
    let env = 'local';
    if (location.host.startsWith('f') || location.href.indexOf('reachtest') > -1) {
        env = 'dev';
    } else if (location.host.startsWith('t') || location.href.indexOf('reach_dist') > -1) {
        env = 'test';
    } else if (location.href.indexOf('pre_') > -1) {
        env = 'pre';
    } else if (location.href.indexOf('pro_') > -1) {
        env = 'pro';
    }

    return env;
}
let env = getCurrentEnv();

Sentry.init({
    environment: env,
    dsn: 'http://1cbaf13eb7904fe4a5a7064bb9cbb0d1@47.99.66.191:9000/3',
    integrations: [
        new Integrations.Vue({
            Vue,
            attachProps: true,
        }),
    ],
});

Vue.config.errorHandler = (err, vm, info) => {
    if (process.env.NODE_ENV !== 'production') {
        Vue.util.warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    console.error(err);
};