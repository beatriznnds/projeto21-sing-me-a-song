describe("top recommendations page", () => {
    it("should return top recomendations", () => {
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.intercept("GET", `/recommendations/top/10`).as("getTopRecommendations");
        cy.visit("http://localhost:3000/top");
        cy.wait("@getTopRecommendations").then(({ response }) => {
            cy.log(response);
            expect(response.body).not.equal(null)
        });
    })
})