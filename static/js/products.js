document.addEventListener("DOMContentLoaded", (event) => {
  const formSortProducts = document.querySelector("#sortForm");
  formSortProducts?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams(new FormData(formSortProducts)).toString();
    const apiURL = `/?${queryParams}`;

    window.location.href = apiURL; // Redirect to the URL with query parameters
});
})

function goToPage(pageValue) {
    console.log(pageValue)
    const currentQueryString = window.location.search;
    const searchParams = new URLSearchParams(currentQueryString);
    searchParams.set('page', pageValue);

    const newQueryString = searchParams.toString();
    const apiURL = `${window.location.pathname}?${newQueryString}`;

    window.location.href = apiURL; // Redirect to the URL with updated page parameter
}
