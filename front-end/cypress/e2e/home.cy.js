
describe("new recommendation test suite", () => {
    const song = {
        name: "SAOKO",
        youtubeLink: "https://www.youtube.com/watch?v=ocliZj7ZXb0"
    };

    it("should add a recommendation", () => {
        cy.visit("http://localhost:3000/");
        cy.get("[data-cy='name-input']").type(song.name);
        cy.get("[data-cy='youtube-input']").type(song.youtubeLink);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("[data-cy='submit-button']").click();
        cy.wait("@newRecommendation");
    });

    it("shouldn't add recommendation that violates unique constraint", () => {
        cy.visit("http://localhost:3000/");
        cy.get("[data-cy='name-input']").type(song.name);
        cy.get("[data-cy='youtube-input']").type(song.youtubeLink);
        cy.intercept("POST", "/recommendations").as("newRecommendation");
        cy.get("[data-cy='submit-button']").click();
        cy.wait("@newRecommendation").then(({ response })=> {
            cy.log(response);
            expect(response.statusCode).to.equal(409);
        });
    });

})