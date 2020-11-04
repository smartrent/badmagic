import { Method } from "badmagic";

const BASE_URL = `http://localhost:3333`;

export default {
  id: "dogs",
  name: "Dogs", // deprecated in favor of `info.title`
  info: {
    title: "Dogs",
    description: "An OpenAPI workspace that's all about dogs!",
    version: "0.0.2",
  },
  tags: [
    {
      name: "dogs",
      description: "API Endpoints to interact with dog data",
    },
  ],
  config: {
    baseUrl: BASE_URL,
  },
  plugins: [],
  servers: [
    {
      url: BASE_URL,
      variables: {},
    },
  ],

  routes: [
    {
      name: "Search Breeds",
      path: "/breeds/list/all",
      responses: {
        "200": {
          description: "successful operation",
          // schema: {
          //   type: "array",
          //   items: {
          //     $ref: "#/definitions/Dog",
          //   },
          // },
        },
      },
    },

    {
      name: "View Random Breed Image",
      path: "/breeds/:breed/images",
      qsParams: [
        {
          name: "sort",
          description: "In which order should the images be returned",
          options: [
            { label: "Newest", value: "newest" },
            { label: "Random", value: "random" },
          ],
        },
      ],
      responses: {
        "200": {
          description: "successful operation",
          // schema: {
          //   type: "array",
          //   items: {
          //     $ref: "#/definitions/Image",
          //   },
          // },
        },
      },
    },

    {
      name: "Add New Breed",
      description: "Create a new breed entry",
      summary: "A way to add new dog breeds",
      path: "/breeds",
      method: Method.POST,
      responses: {
        "200": {
          description: "successful operation",
          // schema: {
          //   type: "array",
          //   items: {
          //     $ref: "#/definitions/Dog",
          //   },
          // },
        },
      },
      body: [
        {
          name: "name",
          required: true,
          placeholder: "German Shepherd",
          description: "Name of the dog breed",
          minLength: 3,
          maxLength: 100,
          nullable: false,
        },
        {
          name: "weight",
          type: "number",
          required: false,
          placeholder: "Weight in pounds",
          description: "Average number of pounds the breed weighs",
          minLength: 5,
          maxLength: 200,
          nullable: true,
        },
      ],
      example: {
        name: "German Shepherd",
      },
      tags: ["dogs"],
    },
  ],
};
