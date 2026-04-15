import { test, expect } from './fixtures';

/*
test('new article page loads successfuly', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage;
    await expect(page.page).toHaveURL('https://demo.realworld.show/editor');
    await expect(page.articleTitle).toBeVisible()
    await expect(page.articleDescription).toBeVisible()
    await expect(page.articleMainText).toBeVisible()
    await expect(page.articleTags).toBeVisible()
    await expect(page.articlePublishButton).toBeVisible()
})

test('fill article with valid info', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage;
    await page.fillArticle('articleTitle', 'articleDescription', 'articleMainText', 'articleTags1', 'articleTags2')
    const expectedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());

    await expect(page.page).toHaveURL('https://demo.realworld.show/article/articletitle');
    await expect(page.createdArticleTitle).toHaveText('articleTitle');
    await expect(page.createdArticleMainText).toHaveText('articleMainText');
    await expect(page.createdArticleTags).toHaveText('articleTags2');
    await expect(page.editArticleButton).toBeVisible()
    await expect(page.deleteArticleButton).toBeVisible()
    await expect(page.commentBox).toBeVisible()
    await expect(page.postCommentButton).toBeVisible()
    await expect(page.articleAuthor).toBeVisible()
    await expect(page.articleDate).toBeVisible()
    await expect(page.articleAuthor).toHaveText(user.username);
    await expect(page.articleDate).toHaveText(expectedDate)
})

const inputs = [
    { articleTitle: '', articleDescription: 'articleDescription', articleMainText: 'articleMainText',  articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'empty title', expectedError: "title can't be blank", expectFail: false },
    { articleTitle: 'articleTitle', articleDescription: '', articleMainText: 'articleMainText',  articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'empty description', expectedError: "description can't be blank", expectFail: false },
    { articleTitle: 'articleTitle', articleDescription: 'articleDescription', articleMainText: '',  articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'empty body', expectedError: "body can't be blank", expectFail: false },
    { articleTitle: '', articleDescription: '', articleMainText: '',  articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'fully empty', expectedError: ["title can't be blank", "description can't be blank", "body can't be blank"], expectFail: false },
];

for (const input of inputs) {
    test(`fill article with empty values - ${input.description}`, async ({loggedInNewArticlePage}) => {

        const {page, user} = loggedInNewArticlePage;
        await page.fillArticle(input.articleTitle, input.articleDescription, input.articleMainText, input.articleTags1, input.articleTags2);

        if (Array.isArray(input.expectedError)) {
            for (const [index, error] of input.expectedError.entries()) {
                await expect(page.errorMessage.nth(index)).toHaveText(error);
            }
        } else {
            await expect(page.errorMessage.nth(0)).toHaveText(input.expectedError);
        }
    })
}

const limitInputs = [
    { articleTitle: 'a'.repeat(100), articleDescription: 'articleDescription', articleMainText: 'articleMainText', articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'title at limit (100 chars)', expectedError: null },
    { articleTitle: 'a'.repeat(101), articleDescription: 'articleDescription', articleMainText: 'articleMainText', articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'title over limit (101 chars)', expectedError: 'body title is a string of less than 100 chars' },
    { articleTitle: 'articleTitle', articleDescription: 'a'.repeat(300), articleMainText: 'articleMainText', articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'description at limit (300 chars)', expectedError: null },
    { articleTitle: 'articleTitle', articleDescription: 'a'.repeat(301), articleMainText: 'articleMainText', articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'description over limit (301 chars)', expectedError: 'body description is a string of less than 300 chars' },
    { articleTitle: 'articleTitle', articleDescription: 'articleDescription', articleMainText: 'a'.repeat(10000), articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'body at limit (10000 chars)', expectedError: null },
    { articleTitle: 'articleTitle', articleDescription: 'articleDescription', articleMainText: 'a'.repeat(10001), articleTags1: 'articleTags1', articleTags2: 'articleTags2', description: 'body over limit (10001 chars)', expectedError: 'body body is a string of less than 10000 chars' },
    { articleTitle: 'articleTitle', articleDescription: 'articleDescription', articleMainText: 'articleMainText', articleTags1: 'articleTags1', articleTags2: 'a'.repeat(19), description: 'tag at limit (19 chars)', expectedError: null },
];

test('fill article with limit values - tag over limit (20 chars)', async ({loggedInNewArticlePage}) => {
    test.fail();
    const {page, user} = loggedInNewArticlePage;
    await page.fillArticle('articleTitle', 'articleDescription', 'articleMainText', 'articleTags1', 'a'.repeat(20));
    await expect(page.errorMessage.nth(0)).toHaveText('body tagList is an optional list of less than 10 strings of less than 20 chars');
});

for (const input of limitInputs) {
    test(`fill article with limit values - ${input.description}`, async ({loggedInNewArticlePage}) => {

        const {page, user} = loggedInNewArticlePage;
        await page.fillArticle(input.articleTitle, input.articleDescription, input.articleMainText, input.articleTags1, input.articleTags2);

        if (input.expectedError === null) {
            await expect(page.page).toHaveURL(/article/);
        } else {
            await expect(page.errorMessage.nth(0)).toHaveText(input.expectedError);
        }
    })
}

const tagInputLimits = [
    {tagLimit: 10},
    {tagLimit: 11},
]

for (const input of tagInputLimits) {
    test(`fill article with ${input.tagLimit} tags`, async ({loggedInNewArticlePage}) => {

        const {page, user} = loggedInNewArticlePage;
        await page.fillArticleCustomTags('articleTitle', 'articleDescription','articleMainText', 'articleTag', input.tagLimit)

        if (input.tagLimit <= 10) {
            await expect(page.page).toHaveURL(/article/);
        } else {
            await expect(page.errorMessage.nth(0)).toHaveText('body tagList is an optional list of less than 10 strings of less than 20 chars');
        }
    })
}


test('duplicate tag', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage;
    await page.fillArticle('articleTitle', 'articleDescription', 'articleMainText', 'articleTags1', 'articleTags1')

    expect(await page.createdArticleTags.count()).toEqual(1);
})

test('edit article', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage;
    await page.fillArticle('articleTitle', 'articleDescription', 'articleMainText', 'articleTags1', 'articleTags2')

    await page.editArticleButton.click();
    await expect(page.articleTitle).toHaveValue('articleTitle');
    await expect(page.articleDescription).toHaveValue('articleDescription');
    await expect(page.articleMainText).toHaveValue('articleMainText');
    expect((await page.tagTextContent.textContent())!.trim()).toEqual('articleTags2');

    await page.fillArticle('newArticleTitle', 'newArticleDescription', 'newArticleMainText', '', 'newArticleTags2')
    await expect(page.createdArticleTitle).toHaveText('newArticleTitle');
    await expect(page.createdArticleMainText).toHaveText('newArticleMainText');
    await expect(page.createdArticleTags).toHaveText('newArticleTags2');
})

*/
test('session timeout', async ({loggedInNewArticlePage}) => {

    const {page, user} = loggedInNewArticlePage

    await page.page.route('https://api.realworld.show/api/articles/', async route => {
        await route.continue({headers: {...route.request().headers(), 'authorization': 'Token expired-token'}});});

    await page.fillArticle('articleTitle', 'articleDescription', 'articleMainText', 'articleTags1', 'articleTags2')
    await expect(page.errorMessage.nth(0)).toHaveText('token is missing')
})
