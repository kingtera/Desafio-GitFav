export class GithubData {
    static search(username) {
        const userLink = `https://api.github.com/users/${username}`

        return fetch(userLink)
               .then(data => data.json())
               .then(({ login, name, public_repos, followers}) => ({
                login,
                name,
                public_repos,
                followers
               }) )
    }
}