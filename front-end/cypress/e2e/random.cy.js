describe("random recommendations", () => {
    it("should return successfully the page", () => {
        cy.visit("http://localhost:3000/");
        const song = {
            name: "LA FAMA",
            youtubeLink: "https://www.youtube.com/watch?v=e-CEd6xrRQc"
        };
        cy.addRecommendation(song);
        cy.get("[data-cy='random']").click();
        cy.intercept("GET", `/recommendations/random`).as("getRandomRecommendations");
        cy.visit("http://localhost:3000/random");
        cy.wait("@getRandomRecommendations").then(({ response }) => {
            cy.log(response);
            expect(response.body).not.equal(null)
        });
    })
})