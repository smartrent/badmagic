import { Method } from "badmagic";

export const dogWorkspace = {
  id: "dogs",
  name: "Dogs",
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
    baseUrl: "http://localhost:3333",
  },
  plugins: [],
  servers: [
    {
      url: "http://localhost:3333",
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
        {
          name: "colors",
          array: true,
          required: true,

          placeholder: "Coat color",
          description: "Color of the dog's coat",
        },
        {
          name: "measurements",
          properties: [
            {
              name: "body",
              type: "number",
            },
            {
              name: "legs",
              type: "number",
            },
            {
              name: "tail",
              type: "number",
            },
          ],
          description: "Average measurements",
        },
        {
          name: "prominent_locations",
          array: true,
          properties: [
            {
              name: "country",
              required: true,
            },
            {
              name: "state_or_province",
            },
            {
              name: "cities",
              array: true,
              properties: [
                { name: "name" },
                {
                  name: "zip_codes",
                  array: true,
                },
              ],
            },
            {
              name: "restrictions",
              properties: [{ name: "cash_only" }, { name: "warranty" }],
            },
          ],
          description: "Prominent locations where the dog is bred",
        },
      ],
      example: {
        name: "German Shepherd",
      },
      tags: ["dogs"],
    },

    {
      name: "Breeds (old)",
      path: "/breeds/list/all",
      responses: {
        "200": {
          description: "successful operation",
        },
      },
      deprecated: true
    },
  ],
};
