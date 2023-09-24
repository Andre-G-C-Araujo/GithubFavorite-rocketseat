import { GithubUser } from "./githubUser";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuario já cadastrado");
      }

      const user = await GithubUser.search(username);

      console.log(user);

      if (user.login === undefined) {
        throw new Error("Usuario nao encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (err) {
      alert(err.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

//classe que vai criar a vizualizacao e eventos do html

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");

    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow(user);

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user img").alt = `
      Imagem de ${user.name};
      `;
      row.querySelector(".user a").textContent = user.name;
      row.querySelector(".user p").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const sure = confirm("Tem certeza que deseja deletar esse perfil??");

        if (sure) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `

            <td class="user">
              <img src="https://github.com/Andre-G-C-Araujo.png" alt="" />
              <a href="https://github.com/Andre-G-C-Araujo" target="_blank">
                <p>Andre Caue</p>
                <span>AndreCaue</span>
              </a>
            </td>
            <td class="repositories">76</td>
            <td class="followers">9589</td>
            <td><button class="remove">&times;</button></td>  
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
