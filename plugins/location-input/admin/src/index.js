import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

import InputLocation from "./components/InputLocation";

export default (strapi) => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    /**
     * ? To show location-input in admin menu you should uncomment code below
     * 
     */
    // menu: {
    //   pluginsSectionLinks: [
    //     {
    //       destination: `/plugins/${pluginId}`,
    //       icon,
    //       label: {
    //         id: `${pluginId}.plugin.name`,
    //         defaultMessage: name,
    //       },
    //       name,
    //       permissions: [
    //         // Uncomment to set the permissions of the plugin here
    //         // {
    //         //   action: '', // the action name should be plugins::plugin-name.actionType
    //         //   subject: null,
    //         // },
    //       ],
    //     },
    //   ],
    // },
    /**
     * ? Above code uncomment to show in admin menu
     */
  };

  strapi.registerField({ type: "location", Component: InputLocation });

  return strapi.registerPlugin(plugin);
};
