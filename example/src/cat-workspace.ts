import { Method } from "badmagic";

export const catWorkspace = {
  id: "cats",
  name: "Cats",
  info: {
    title: "Cats",
    description: "An OpenAPI workspace that's all about cats!",
    version: "0.0.2",
  },
  tags: [
    {
      name: "cats",
      description: "API Endpoints to interact with cat data",
    },
  ],
  config: {
    baseUrl: "http://localhost:3333",
  },
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
          //     $ref: "#/definitions/Cat",
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
      summary: "A way to add new cat breeds",
      path: "/breeds",
      method: Method.POST,
      responses: {
        "200": {
          description: "successful operation",
          // schema: {
          //   type: "array",
          //   items: {
          //     $ref: "#/definitions/Cat",
          //   },
          // },
        },
      },
      body: [
        {
          name: "name",
          required: true,
          placeholder: "Tabby",
          description: "Name of the cat breed",
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
          description: "Color of the cat's coat",
        },
        {
          name: "time_of_birth",
          required: true,
          placeholder: "2022-02-25T12:00:00.000Z",
          description: "Cat's time of birth",
        },
        {
          name: "adoption_day",
          placeholder: "2022-02-25",
          description: "Cat's date of adoption",
        },
        {
          name: "nap_time",
          required: true,
          placeholder: "12:00:00",
          description: "Cat's preferred time to nap",
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
          description: "Prominent locations where the cat is bred",
        },
        {
          name: "info",
          description: "Here is some info about this field",
        },
      ],
      example: {
        name: "Tabby",
      },
      tags: ["cats"],
    },

    {
      name: "Breeds (old)",
      path: "/breeds/list/all",
      responses: {
        "200": {
          description: "successful operation",
        },
      },
      deprecated: true,
    },
  ],
};
