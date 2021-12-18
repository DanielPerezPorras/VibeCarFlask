# VibeCarServer
Project developed using React as frontend, Flask as backend and MongoDB as Database, for the Web Engineering subject of the Software Engineering Degree.🐱‍👓

## Index

* [React](#react---)
   * [Installation](#installation)
   * [Folder structure](#folder-structure)
* [Flask](#flask---)
   * [Installation](#installation-1)
   * [Folder structure](#folder-structure-1)
* [Run application](#run-application---)
* [Team Members](#team-members)

## React <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>

### Installation⚙
> **NOTE:** You need to have [Node JS](https://nodejs.org/) installed to work with this page.
- Go to frontend folder associated to React's project and use the following command:  
  ```
  npm install
  ```
- If you experience problems with Map use <a href="https://stackoverflow.com/questions/67552020/how-to-fix-error-failed-to-compile-node-modules-react-leaflet-core-esm-pat" target="_blank">this link</a>.  

### Folder structure📁
- **public**: This folder contains the favicon of our web app and the html of our one page application.  
- **src**: This folder contains the folders of our project and the index.js.  
    - **Components**: This folder contains all the js components of our app.  
    - **Assets**: This folder contains all the assets that our app will use.  
    - **Styles**: This folder contains all the css styles of our page.  

## Flask <a href="https://flask.palletsprojects.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg" alt="flask" width="40" height="40"/> </a>

### Installation⚙
*All this instructions are presumming you are using Windows if you are using Linux or Mac, commands will be different*  
 1. First, you have to create a virtual enviroment for administrating this project:  
    1. Go to the backend folder associated to Flask's project and use the following command: 
       ```
       python -m venv env
       ```    
    2. From now on, all instructions are for Visual Studio Code users.  
       1. In VS Code, open the Command Palette (**View** > **Command Palette** or *(Ctrl+Shift+P)*).  
       2. Select the *Python: Select Interpreter* command and from the list, select the virtual enviroment in your project folder that starts with */env* or *\env*, if you don't find it in the list then select **Enter interpreter path...** and **Find...**, after this enter the route: **.\backend\env\Scripts\python.exe** or **.\env\Scripts\python.exe**.  
       3. Run **Terminal: Create New Terminal** *(Ctrl+Shift+`)* from the Command Palette, which creates a terminal and automatically activates the virtual enviromentby running its activation script.  
          > **Note**: On Windows, if your default terminal type is PowerShell, you may see an error that it cannot run activate.ps1 because running scripts is disabled on the system. The error provides a link for information on how to allow scripts. Otherwise, use **Terminal: Select Default Shell** to set *Command Prompt(cmd)* or *Git Bash* as your default instead.
            If you are still having problems, you can also create manually a cmd terminal and use the command **env/scripts/activate** to activate the virtual enviroment.
       4. The selected enviroment appears on the left side of the VS Code status bar, and notices the "(venv)" indicator that tells you that you're using a virtual enviroment.  
 2. Then, make sure you are using the virtual enviroment by checking that your terminal has **(env)** or the name you are using for your virtual enviroment, at the beginning of your current command line and use the following command 
    ```
    pip install -r requirements.txt
    ```
    Otherwise you'll be installing all the dependencies in your python core.  
 3. Once, you have installed the requirements, you have to fixed a <a href="https://stackoverflow.com/questions/67728474/modulenotfounderror-no-module-named-flask-compat" target="_blank">bug in Flask-Script</a>. Go to <strong>env/Lib/site-packages/flask_script/\_\_init\_\_.py</strong> and replace this line  
    ```python
    from flask._compat import text_type
    ``` 
    by  
    ```python
    from flask_script._compat import text_type
    ```
 4. Add a config.py to your *app/rest* folder with this content:
    ```python
    # .gitignore should include reference to config.py
    cloud_name = "YOUR CLOUDINARY NAME", 
    cloud_api_key = "YOUR CLOUDINARY API KEY", 
    cloud_api_secret = "YOUR CLOUDINARY API SECRET"
    ```
### Folder structure📂
- **requirements.txt**: File with the dependecies of the Python project.  
- **api**: This folder stores files related with OpenAPI specifications or external programs to test your API such as <a href="https://insomnia.rest/" target="_blank">Insomnia</a> or <a href="https://www.postman.com/" target="_blank">Postman</a>.  
- **app**: This folder stores app.py, which is the core script to run all your scripts, and *rest* folder.  
    - **rest**: This folder stores all your scripts related to API Rest.  
- **datasets**: This folder contains all your datasets.  
- **env**: This is your virtual enviroment.  


## Run application <img src="https://www.svgrepo.com/show/16272/programming-code.svg" alt="inicio aplicacion" width="40" height="40"/>
To run the app you can either:  
- To create the database, launch the command (inside the backend folder):
  ```
  python creardb.py
  ```
  - Type **vibecar** in a cmd opened in your project (if you are a Windows user) to run the *vibecar.bat*.  
  - Or open two terminals:
    - The first one must be in the backend folder with the env activated, and use the command:  
      ```
      python main.py runserver -h localhost -p 8080
      ```
    - The second one must be in the frontend folder, and use the command:  
      ```
      npm start
      ```

## Team Members
This project was made by:
- <a href="https://github.com/GuillermoAguado" target="_blank">Guillermo Eduardo Aguado Mole&oacute;n</a>
- <a href="https://github.com/franUma" target="_blank">Francisco Guerrero P&eacute;rez</a>
- <a href="https://github.com/manuleivaUma" target="_blank">Manuel Leiva G&oacute;mez</a>
- <a href="https://github.com/DanielPerezPorras" target="_blank">Daniel P&eacute;rez Porras</a>
- <a href="https://github.com/FranciscoSedeno" target="_blank">Francisco Jos&eacute; Sede&ntilde;o Guerrero</a>
     
