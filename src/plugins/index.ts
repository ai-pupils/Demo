import Vue, { VueConstructor } from "vue";
import msgbox$ from "@/plugins/msgbox";


const msgboxInstall = function(Vue: VueConstructor<Vue>) {
    Vue.prototype.msgbox$ = msgbox$;
};

export default {
    msgbox: msgboxInstall
}
