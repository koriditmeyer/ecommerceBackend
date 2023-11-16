/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html, js}",
  "./views/**/*.{handlebars,hbs}"  // ! Necessary to configure Tailwind CSS to work with Handlebars templates, 
],
  theme: {
    extend: {},
  },
  plugins: [],
}

