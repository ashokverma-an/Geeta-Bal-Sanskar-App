import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-Y2O7NDPK.js";
import "./chunk-2KIDQFFW.js";
import "./chunk-OIZAD6NR.js";
import "./chunk-H3GUZCWI.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-YMAZNHEH.js";
import "./chunk-A7ZZ5EUY.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-X7D2E2KK.js";
import "./chunk-T72SRRIE.js";
import "./chunk-RNI5NECK.js";
import "./chunk-POCNHGV4.js";
import "./chunk-FE3IXHWA.js";
import "./chunk-MPZLQZTH.js";
import "./chunk-YNS6MFUP.js";
import "./chunk-HURUULSR.js";
import "./chunk-7O3Z3JHL.js";
import "./chunk-233O5NGX.js";
import "./chunk-OTUQSG42.js";
import "./chunk-UU5Z7QKS.js";
import "./chunk-AZIGWIX2.js";
import "./chunk-TRES2BGH.js";
import "./chunk-LHTRMQT6.js";
import "./chunk-ZIRKGBIS.js";
import "./chunk-RO3ZOAWR.js";
import "./chunk-LS3J2DJE.js";
import "./chunk-XMOOF65I.js";
import "./chunk-M3HR6BUY.js";
import "./chunk-PDBU26CW.js";
import "./chunk-SWUZXYXF.js";
import "./chunk-UDU42JBG.js";
import "./chunk-TFPZUFYF.js";
import "./chunk-F44P23JR.js";
import "./chunk-LB247S5T.js";
import "./chunk-OKFPZD64.js";
import "./chunk-VNWLEULA.js";
import "./chunk-65RJ5ZZ2.js";
import "./chunk-47WIQBSG.js";
import "./chunk-ILYRWJDS.js";
import "./chunk-NMDRHVDG.js";
import "./chunk-ZXHFWG3Y.js";
import "./chunk-7FY6VJ6T.js";
import "./chunk-5UEM3QDS.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-EIB7IA3J.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanelWrap', [
  //   transition('* => void', query('@transformPanel', [animateChild()], {optional: true})),
  // ])
  /**
   * This animation ensures the select's overlay panel animation (transformPanel) is called when
   * closing the select.
   * This is needed due to https://github.com/angular/angular/issues/23302
   */
  transformPanelWrap: {
    type: 7,
    name: "transformPanelWrap",
    definitions: [{
      type: 1,
      expr: "* => void",
      animation: {
        type: 11,
        selector: "@transformPanel",
        animation: [{
          type: 9,
          options: null
        }],
        options: {
          optional: true
        }
      },
      options: null
    }],
    options: {}
  },
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [{
      type: 0,
      name: "void",
      styles: {
        type: 6,
        styles: {
          opacity: 0,
          transform: "scale(1, 0.8)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => showing",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 1,
            transform: "scale(1, 1)"
          },
          offset: null
        },
        timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
      },
      options: null
    }, {
      type: 1,
      expr: "* => void",
      animation: {
        type: 4,
        styles: {
          type: 6,
          styles: {
            opacity: 0
          },
          offset: null
        },
        timings: "100ms linear"
      },
      options: null
    }],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
