import {Page, Locator} from '@playwright/test';

export interface ArticleData {
    articleTitle: string;
    articleDescription: string;
    articleMainText: string;
    articleTags1: string;
    articleTags2: string;
}

export class NewArticlePage {
    readonly page: Page;
    readonly articleTitle: Locator;
    readonly articleDescription: Locator;
    readonly articleMainText: Locator;
    readonly articleTags: Locator;
    readonly articlePublishButton: Locator;
    readonly createdArticleTitle: Locator;
    readonly createdArticleMainText: Locator;
    readonly createdArticleTags: Locator;
    readonly editArticleButton: Locator;
    readonly deleteArticleButton: Locator;
    readonly commentBox: Locator;
    readonly postCommentButton: Locator;
    readonly removeTag: Locator;
    readonly articleAuthor: Locator;
    readonly articleDate: Locator;
    readonly errorMessage: Locator;
    readonly tagTextContent: Locator;
    readonly userProfile: Locator;
    readonly myWrittenArticle: Locator;
    readonly deleteCommentButton: Locator;
    readonly newComment: Locator;
    readonly profileErrorMessage: Locator;



    constructor(page: Page) {
        this.page = page;
        this.articleTitle = page.getByPlaceholder("Article Title");
        this.articleDescription = page.getByPlaceholder("What's this article about?");
        this.articleMainText = page.getByPlaceholder("Write your article (in markdown)")
        this.articleTags = page.getByPlaceholder("Enter tags");
        this.articlePublishButton = page.getByRole("button", {name: "Publish Article"});
        this.createdArticleTitle = page.locator('.container h1')
        this.createdArticleMainText = page.locator('.col-md-12 p')
        this.createdArticleTags = page.locator('.tag-list')
        this.editArticleButton = page.getByRole("link", {name: "Edit Article"}).nth(0);
        this.deleteArticleButton = page.getByRole("button", {name: "Delete Article"}).nth(0);
        this.commentBox = page.getByPlaceholder('Write a comment...');
        this.postCommentButton = page.getByRole("button", {name: "Post Comment"});
        this.removeTag = page.locator('.tag-default.tag-pill .ion-close-round')
        this.articleAuthor = page.locator('.author').nth(0)
        this.articleDate = page.locator('.date').nth(0)
        this.errorMessage = page.locator('.error-messages li')
        this.tagTextContent = page.locator('.tag-default.tag-pill')
        this.userProfile = page.locator(`a.nav-link[href*="/profile/"]`)
        this.myWrittenArticle = page.locator('.article-preview')
        this.newComment = page.locator('.card-block .card-text')
        this.deleteCommentButton = page.locator('.mod-options .ion-trash-a')
        this.profileErrorMessage = page.locator('.error-messages li')
    }



    async fillArticle({ articleTitle, articleDescription, articleMainText, articleTags1, articleTags2 }: ArticleData) : Promise<void> {

        await this.articleTitle.fill(articleTitle);
        await this.articleDescription.fill(articleDescription);
        await this.articleMainText.fill(articleMainText);
        await this.articleTags.fill(articleTags1);
        await this.articleTags.press('Enter')
        await this.articleTags.fill(articleTags2);
        await this.articleTags.press('Enter')
        await this.removeTag.nth(0).waitFor({ state: 'visible' });
        await this.removeTag.nth(0).click()
        await this.articlePublishButton.click();
    }

    async fillArticleCustomTags(articleTitle: string, articleDescription: string, articleMainText: string, articleTags: string, tagLimit: number) : Promise<void> {

        await this.articleTitle.fill(articleTitle);
        await this.articleDescription.fill(articleDescription);
        await this.articleMainText.fill(articleMainText);

        for (let i = 0; i < tagLimit; i++) {

            await this.articleTags.fill(`${articleTags}${i}`)
            await this.articleTags.press('Enter')
        }
        await this.articlePublishButton.click();
    }

    async editArticle(data: ArticleData) : Promise<void> {

        await this.editArticleButton.click();
        await this.fillArticle(data);
    }

    async writeComment(comment: string) : Promise<void> {

        await this.commentBox.fill(comment);
        await this.postCommentButton.click();
    }

    async deleteArticle() : Promise<void> {

        await this.deleteArticleButton.click();
    }
}