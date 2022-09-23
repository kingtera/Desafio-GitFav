import { GithubData } from "./Github.js"

export class FavoritesData {
    constructor(root) {
        this.root = document.querySelector(root)
        this.loadFavorites()
    }

    loadFavorites() {
        this.listOfFavorites = JSON.parse(localStorage.getItem('githubFavorites:')) || []
    }

    save() {
        localStorage.setItem('githubFavorites:', JSON.stringify(this.listOfFavorites))
    }

    async addFavorite(username) {
        try {
            const userAlreadyAdded = this.listOfFavorites.find(user => user.login === username)
            if(userAlreadyAdded) {
                throw new Error('Usuário já foi adicionado')
            }

            const user = await GithubData.search(username)
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.listOfFavorites = [user, ...this.listOfFavorites]
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        this.listOfFavorites = this.listOfFavorites
        .filter(favorites => favorites.login !== user.login)

        this.update()
        this.save()
    }

}

export class FavoritesView extends FavoritesData{
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('tbody.fav')
        this.update()
        this.onadd()
    }

    onadd() {
        const buttonSearch = this.root.querySelector('.search button')
        
        buttonSearch.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.addFavorite(value)
            this.root.querySelector('.search input').value = ''
        }
    }

    update() {
        this.clearAllRows()

        this.listOfFavorites.forEach(user => { 
            const row = this.createRow()

            row.querySelector('img').src = `https://github.com/${user.login}.png`
            row.querySelector('img').alt = `imagem de ${user.name}`
            row.querySelector('a').href = `https://github.com/${user.login}`
            row.querySelector('p').textContent = `${user.name}`
            row.querySelector('span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            const removeButton = row.querySelector('.removeButton')
            removeButton.onclick = () => {
                const answer = confirm('Tem certeza que deseja remover o usuário?')
                if(answer) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const newRow = document.createElement('tr')

        newRow.innerHTML = 
            `<td class="user">
                <img src="https://github.com/.png" alt="">
                <a href="https://github.com/" target="_blank">
                    <p></p>
                    <span></span>
                </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td>
                <button class="removeButton">Remover</button>
            </td>`

        return newRow
    }

    clearAllRows() {
        if(this.listOfFavorites.length !== 0) {
            this.root.querySelector('.no-fav').classList.add('hide')
        } else {
            this.root.querySelector('.no-fav').classList.remove('hide')
        }

        this.tbody.querySelectorAll('tr').forEach( row => {
            row.remove()
        });
    }
}