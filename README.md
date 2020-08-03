## Architecture Patterns • Front-end edition

Okay, lets talk about architecture patterns for front-end projects! I don't even have to start talking about the importance of choosing a good Pattern when you are stating a new project. It can help to mantain a easy to read code, more escalable and more flexible to changes. Besides being able (if done correctly) help to create more powerful and fast apps.

Thank God, not always every company has the care to create an application and using  proper ways to deploy it. Because of that, we can inspect the way their code had been written.

```
JavaScript has gained so much popularity recently and many MV* based JS frameworks are made and gained popularities among JS developers.
```

Those MV* are important way to **separate concerns** and the most knowledge patterns are:

![MVC](https://raw.githubusercontent.com/vitorCamargo/architecture-patterns/master/images/mvc.png)

![MVP](https://raw.githubusercontent.com/vitorCamargo/architecture-patterns/master/images/mvp.png)

![MVVM](https://raw.githubusercontent.com/vitorCamargo/architecture-patterns/master/images/mvvm.png)

Well, you need to understand some of those concepts right? OK!
- Models manage the data for an application.
- View will be the edge visualization for the final user. You can imagine something purelly visual.
- Controllers would be responsible for handling changes, manage actions between models to show up on views.
- Presenter acts as a “middle-man” between Model and View. Thus, all presentation logic is pushed to the presenter. When the presenter gets the model, it updates the view with different handlers and the view will then update the UI.
- The ViewModel can be considered a specialized Controller that acts as a data converter

OK, now that we understand about which one is better, you need to get that it depends on your project, wich one has pros and cons and should be used based on the complexity/size/escalability of your project. BUUUT, we have to be real, we always will choose one because in ours minds, one of them are easiest, provides more options for developing solutions, etc..

In my projects, I've been using a lot of React Hooks and discovering that are a lot of things that can be used to improve cache, momery, getting recources from the browser and even the first loading time (wich in React, can be very long if you don't create better ways to control data, assets and other resources). In my humble opnion, studing these MV*, the best one in a general term is MVVM, is used in a lot applications, can be very easily escalable and very praticle to use.

### Frameworks

Let's talk about frameworks that can be used to create a folder/project MVVM structure. The most knowledge are:
- KnockoutJS
```javascript
var viewModel = {
    self.reactOptions = {
        component: ReactButton,
            props: {
                color: 'red',
                type: 'primary'
            }
    };
};
return (<div data-bind="react: reactOptions"><div>);
```

- MobX
```javascript
import { observer } from 'mobx-react'
const UserOrderInfo = observer(() => {
  const { user, order } = useStores()
  return (
    <div>
      {user.name} has order {order.id}
    </div>
  )
})
```

- Native
```javascript
const newContext = React.createContext({ color: 'black' });
const value = useContext(newContext);
console.log(value);
```

There are other options, but I don't like them a lot, like REDUX. **Besides all this, those framworks is used to create the solutions, you still have to organizate the best part/folder in your project to put your provides/contexts, views, modelViews, etc..**.

I personnaly like to use the native way, for that, you should have a folder to place the Providers instances/Contexts/Reducers (YESS, reducers, but NOT Redux [the native reducer]), a folder for assets, a folder to utils, a folder for components and a folder to your pages. In the last 2 items, is important to create a 'index.js' file, that will be you **ViewModel** and the other files will be **Views**. Opssie, I forgot to say about the **Model**, for that, create a folder too 😅.

### Let's see what companies are doing

- [National Geographic](./national-geographic)
- [iFood](./ifood)
- [Americanas](./americanas)
- [Submarino](./submarino)
- [Kanui](./kanui)
- [Saraiva](./saraiva)
- [Wix](./wix)
- [Nubank](https://nubank.com.br/en/)
- [SandBox](https://codesandbox.io/s/21vrnxyy3j?file=/src/TodoApp.js)
- [Cruunchify](https://cruuunchify.com/)

For the last 3 sites, you can just open Inpect and look at `Sources` in a package called `//webpack`, all the files are there.
