const config = {
  extends: "../../tsconfig.json",
  compilerOptions: {
    baseUrl: "./",
    paths: {
      "~shared": ["./src/shared"],
      "~web/app.component": ["./src/app/app.component"],
      "~web/app.module": ["./src/app/app.module"],
      "~web/app-routing.module": ["./src/app/app-routing.module"],
      "~web/account/*": [
        "./src/app/account/*",
        "./src/app/account/child-components/*",
        "./src/app/account/components/*",
        "./src/app/account/directives/*",
        "./src/app/account/forms/*",
        "./src/app/account/pipes/*",
        "./src/app/account/interfaces/*",
        "./src/app/account/services/*"
      ],
      "~web/app-shell/*": [
        "./src/app/app-shell/*",
        "./src/app/app-shell/child-components/*",
        "./src/app/app-shell/components/*",
        "./src/app/app-shell/directives/*",
        "./src/app/app-shell/forms/*",
        "./src/app/app-shell/pipes/*",
        "./src/app/app-shell/interfaces/*",
        "./src/app/app-shell/services/*"
      ],
      "~web/components/*": [ "./src/app/components/*" ],
      "~web/data-structure/*": ["./src/app/data-structure/*"],
      "~web/date-time/*": [
        "./src/app/date-time/*",
        "./src/app/date-time/child-components/*",
        "./src/app/date-time/components/*",
        "./src/app/date-time/directives/*",
        "./src/app/date-time/forms/*",
        "./src/app/date-time/pipes/*",
        "./src/app/date-time/interfaces/*",
        "./src/app/date-time/services/*"
      ],
      "~web/delivery/*": [
        "./src/app/delivery/*",
        "./src/app/delivery/child-components/*",
        "./src/app/delivery/components/*",
        "./src/app/delivery/directives/*",
        "./src/app/delivery/forms/*",
        "./src/app/delivery/pipes/*",
        "./src/app/delivery/interfaces/*",
        "./src/app/delivery/services/*"
      ],
      "~web/donation/*": [
        "./src/app/donation/*",
        "./src/app/donation/child-components/*",
        "./src/app/donation/components/*",
        "./src/app/donation/directives/*",
        "./src/app/donation/forms/*",
        "./src/app/donation/pipes/*",
        "./src/app/donation/interfaces/*",
        "./src/app/donation/services/*"
      ],
      "~web/donation-delivery-shared/*": [
        "./src/app/donation-delivery-shared/*",
        "./src/app/donation-delivery-shared/child-components/*",
        "./src/app/donation-delivery-shared/components/*",
        "./src/app/donation-delivery-shared/directives/*",
        "./src/app/donation-delivery-shared/forms/*",
        "./src/app/donation-delivery-shared/pipes/*",
        "./src/app/donation-delivery-shared/interfaces/*",
        "./src/app/donation-delivery-shared/services/*"
      ],
      "~web/donor/*": [
        "./src/app/donor/*",
        "./src/app/donor/child-components/*",
        "./src/app/donor/components/*",
        "./src/app/donor/directives/*",
        "./src/app/donor/forms/*",
        "./src/app/donor/pipes/*",
        "./src/app/donor/interfaces/*",
        "./src/app/donor/services/*"
      ],
      "~web/environments/*": ["./src/environments/*"],
      "~web/event/*": [
        "./src/app/event/*",
        "./src/app/event/child-components/*",
        "./src/app/event/components/*",
        "./src/app/event/directives/*",
        "./src/app/event/forms/*",
        "./src/app/event/pipes/*",
        "./src/app/event/interfaces/*",
        "./src/app/event/services/*"
      ],
      "~web/filter-list/*": [
        "./src/app/filter-list/*",
        "./src/app/filter-list/child-components/*",
        "./src/app/filter-list/components/*",
        "./src/app/filter-list/directives/*",
        "./src/app/filter-list/forms/*",
        "./src/app/filter-list/pipes/*",
        "./src/app/filter-list/interfaces/*",
        "./src/app/filter-list/services/*"
      ],
      "~web/fundraise/*": [
        "./src/app/fundraise/*",
        "./src/app/fundraise/child-components/*",
        "./src/app/fundraise/components/*",
        "./src/app/fundraise/directives/*",
        "./src/app/fundraise/forms/*",
        "./src/app/fundraise/pipes/*",
        "./src/app/fundraise/interfaces/*",
        "./src/app/fundraise/services/*"
      ],
      "~web/heuristics/*": [
        "./src/app/heuristics/*",
        "./src/app/heuristics/child-components/*",
        "./src/app/heuristics/components/*",
        "./src/app/heuristics/directives/*",
        "./src/app/heuristics/forms/*",
        "./src/app/heuristics/pipes/*",
        "./src/app/heuristics/interfaces/*",
        "./src/app/heuristics/services/*"
      ],
      "~web/map/*": [
        "./src/app/map/*",
        "./src/app/map/child-components/*",
        "./src/app/map/components/*",
        "./src/app/map/directives/*",
        "./src/app/map/forms/*",
        "./src/app/map/interfaces/*",
        "./src/app/map/pipes/*",
        "./src/app/map/services/*"
      ],
      "~web/material.module": ["./src/app/material.module"],
      "~web/notification/*": [
        "./src/app/notification/*",
        "./src/app/notification/child-components/*",
        "./src/app/notification/components/*",
        "./src/app/notification/directives/*",
        "./src/app/notification/forms/*",
        "./src/app/notification/pipes/*",
        "./src/app/notification/interfaces/*",
        "./src/app/notification/services/*"
      ],
      "~web/password/*": [
        "./src/app/password/*",
        "./src/app/password/child-components/*",
        "./src/app/password/components/*",
        "./src/app/password/directives/*",
        "./src/app/password/forms/*",
        "./src/app/password/pipes/*",
        "./src/app/password/interfaces/*",
        "./src/app/password/services/*"
      ],
      "~web/session/*": [
        "./src/app/session/*",
        "./src/app/session/child-components/*",
        "./src/app/session/components/*",
        "./src/app/session/directives/*",
        "./src/app/session/forms/*",
        "./src/app/session/interfaces/*",
        "./src/app/session/pipes/*",
        "./src/app/session/services/*"
      ],
      "~web/shared/*": [
        "./src/app/shared/*",
        "./src/app/shared/child-components/*",
        "./src/app/shared/components/*",
        "./src/app/shared/directives/*",
        "./src/app/shared/forms/*",
        "./src/app/shared/interfaces/*",
        "./src/app/shared/pipes/*",
        "./src/app/shared/services/*"
      ],
      "~web/signup/*": [
        "./src/app/signup/*",
        "./src/app/signup/child-components/*",
        "./src/app/signup/components/*",
        "./src/app/signup/directives/*",
        "./src/app/signup/forms/*",
        "./src/app/signup/interfaces/*",
        "./src/app/signup/pipes/*",
        "./src/app/signup/services/*"
      ],
      "~web/table/*": [
        "./src/app/table/*",
        "./src/app/table/child-components/*",
        "./src/app/table/components/*",
        "./src/app/table/directives/*",
        "./src/app/table/forms/*",
        "./src/app/table/interfaces/*",
        "./src/app/table/pipes/*",
        "./src/app/table/services/*"
      ]
    },
    sourceMap: true,
    types: ["node"]
  },
  include: [
    "src/**/*.ts"
  ],
  exclude: [
    "src/test.ts",
    "src/**/*.spec.ts"
  ]
};

module.exports = config;
