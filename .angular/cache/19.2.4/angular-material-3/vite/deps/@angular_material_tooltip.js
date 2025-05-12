import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTooltip,
  MatTooltipModule,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError
} from "./chunk-V334ACMO.js";
import "./chunk-HURUULSR.js";
import "./chunk-7O3Z3JHL.js";
import "./chunk-233O5NGX.js";
import "./chunk-OIBNGD5S.js";
import "./chunk-OTUQSG42.js";
import "./chunk-UU5Z7QKS.js";
import "./chunk-AZIGWIX2.js";
import "./chunk-LHTRMQT6.js";
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

// node_modules/@angular/material/fesm2022/tooltip.mjs
var matTooltipAnimations = {
  // Represents:
  // trigger('state', [
  //   state('initial, void, hidden', style({opacity: 0, transform: 'scale(0.8)'})),
  //   state('visible', style({transform: 'scale(1)'})),
  //   transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
  //   transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
  // ])
  /** Animation that transitions a tooltip in and out. */
  tooltipState: {
    type: 7,
    name: "state",
    definitions: [{
      type: 0,
      name: "initial, void, hidden",
      styles: {
        type: 6,
        styles: {
          opacity: 0,
          transform: "scale(0.8)"
        },
        offset: null
      }
    }, {
      type: 0,
      name: "visible",
      styles: {
        type: 6,
        styles: {
          transform: "scale(1)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "* => visible",
      animation: {
        type: 4,
        styles: null,
        timings: "150ms cubic-bezier(0, 0, 0.2, 1)"
      },
      options: null
    }, {
      type: 1,
      expr: "* => hidden",
      animation: {
        type: 4,
        styles: null,
        timings: "75ms cubic-bezier(0.4, 0, 1, 1)"
      },
      options: null
    }],
    options: {}
  }
};
export {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY,
  MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  MatTooltip,
  MatTooltipModule,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError,
  matTooltipAnimations
};
//# sourceMappingURL=@angular_material_tooltip.js.map
