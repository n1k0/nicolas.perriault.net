---
title: Chaining HTTP requests in Elm
excerpt: Sometimes in Elm you struggle with the most basic things. Especially when you come from a JavaScript background, where chaining HTTP requests are relatively easy thanks to Promises or async/await.
date: 2018-02-05
categories: code
tags: elm programming webdev javascript react
origin:
  name: Allo-Media Tech blog
  url: https://tech.allo-media.net/learning/elm/2018/02/05/chaining-http-requests-in-elm.html
---

*Preliminary note: in this article we'll use Elm [decoders](https://guide.elm-lang.org/interop/json.html), [tasks](http://ohanhi.com/tasks-in-modern-elm.html), [results](https://guide.elm-lang.org/error_handling/result.html) and leverage the [Elm Architecture]. If you're not comfortable with these concepts, you may want to check their respective documentation.*

Sometimes in Elm you struggle with the most basic things.

Especially when you come from a JavaScript background, where chaining HTTP requests are relatively easy thanks to Promises. Here's a real-world example leveraging the Github public API, where we fetch a list of Github events, pick the first one and query some user information from its unique identifier.

The first request uses the `https://api.github.com/events` endpoint, and the retrieved JSON looks like this:

```json
[
    {
        "id": "987654321",
        "type": "ForkEvent",
        "actor": {
            "id": 1234567,
            "login": "foobar",
        }
    },
]
```

I'm purposely omitting a lot of other properties from the records here, for brevity.

The second request we need to do is on the `https://api.github.com/users/{login}` endpoint, and its body looks like this:

```json
{
    "id": 1234567,
    "login": "foobar",
    "name": "Foo Bar",
}
```

Again, I'm just displaying a few fields from the actual JSON body here.

So we basically want:

- from a list of events, to pick the first one if any,
- then pick its `actor.login` property,
- query the user details endpoint using this value,
- extract the user real name for that account.

Using JavaScript, that would look like this:

```js
fetch("https://api.github.com/events")
    .then(responseA => {
        return responseA.json()
    })
    .then(events => {
        if (events.length == 0) {
            throw "No events."
        }
        const { actor : { login } } = events[0]
        return fetch(`https://api.github.com/users/${login}`)
    })
    .then(responseB => {
        return responseB.json()
    })
    .then(user => {
        if (!user.name) {
            console.log("unspecified")
        } else {
            console.log(user.name)
        }
    })
    .catch(err => {
        console.error(err)
    })
```

It would get a little fancier using `async/await`:

```js
try {
    const responseA = await fetch("https://api.github.com/events")
    const events = await responseA.json()
    if (events.length == 0) {
        throw "No events."
    }
    const { actor: { login } } = events[0]
    const responseB = await fetch(`https://api.github.com/users/${login}`)
    const user = await responseB.json()
    if (!user.name) {
        console.log("unspecified")
    } else {
        console.log(user.name)
    }
} catch (err) {
    console.error(err)
}
```

This is already complicated code to read and understand, and it's tricky to do using Elm as well. Let's see how to achieve the same, understanding exactly what we're doing (we've all blindly copied and pasted code in the past, don't deny).

First, let's write the two requests we need; one for fetching the list of events, the second to obtain a given user's details from her `login`:

```haskell
import Http
import Json.Decode as Decode

eventsRequest : Http.Request (List String)
eventsRequest =
    Http.get "https://api.github.com/events"
    (Decode.list (Decode.at [ "actor", "login" ] Decode.string))

nameRequest : String -> Http.Request String
nameRequest login =
    Http.get ("https://api.github.com/users/" ++ login)
        (Decode.at [ "name" ]
            (Decode.oneOf
                [ Decode.string
                , Decode.null "unspecified"
                ]
            )
        )
```

These two functions return `Http.Request` with the type of data they'll retrieve and decode from the JSON body of their respective responses. `nameRequest` handles the case where Github users don't have entered their full name yet, so the `name` field might be a `null`; as with the JavaScript version, we then default to `"unspecified"`.

That's good but now we need to execute and chain these two requests, the second one depending on the result of the first one, where we retrieve the `actor.login` value of the event object.

Elm is a pure language, meaning you can't have side effects in your functions (a side effect is when functions alter things outside of their scope and use these things: an HTTP request is a *huge* side effect). So your functions must return *something* that represents a given side effect, instead of executing it within the function scope itself. The Elm runtime will be in charge of actually performing the side effect, using a [Command].

In Elm, you're usually going to use a [Task] to describe side effects. Tasks may succeed or fail (like Promises do in JavaScript), but they need to be turned into an [Elm command] to be actually executed.

To quote this [excellent post on Tasks](http://ohanhi.com/tasks-in-modern-elm.html):

> I find it helpful to think of tasks as if they were shopping lists. A shopping list contains detailed instructions of what should be fetched from the grocery store, but that doesn’t mean the shopping is done. I need to use the list while at the grocery store in order to get an end result

But why do we need to convert a `Task` into a command you may ask? Because a command can execute a single thing at a time, so if you need to execute multiple side effects at once, you'll need a single task that represents all these side effects.

So basically:

1. We first craft `Http.Request`s,
2. We turn them into `Task`s we can chain,
3. We turn the resulting `Task` into a command,
4. This command is executed by the runtime, and we get a result

The [Http] package provides `Http.toTask` to map an `Http.Request` into a `Task`. Let's use that here:

```haskell
fetchEvents : Task Http.Error (List String)
fetchEvents =
    eventsRequest |> Http.toTask

fetchName : String -> Task Http.Error String
fetchName login =
    nameRequest login |> Http.toTask
```

I created these two simple functions mostly to focus on their return types; a `Task` must define an error type and a result type. For example, `fetchEvents` being an HTTP task, it will receive an `Http.Error` when the task fails, and a list of strings when the task succeeds.

But dealing with HTTP errors in a granular way being out of scope of this blog post, and in order to keep things as simple and concise as possible, I'm gonna use `Task.mapError` to turn complex HTTP errors into their string representations:  

```haskell
toHttpTask : Http.Request a -> Task String a
toHttpTask request =
    request
        |> Http.toTask
        |> Task.mapError toString

fetchEvents : Task String (List String)
fetchEvents =
    toHttpTask eventsRequest

fetchName : String -> Task String String
fetchName login =
    toHttpTask (nameRequest login)
```

Here, `toHttpTask` is a helper turning an `Http.Request` into a `Task`, transforming the `Http.Error` complex type into a serialized, purely textual version of it: a `String`.

We'll also need a function allowing to extract the very first element of a list, if any, as we did in JavaScript using `events[0]`. Such a function is builtin the `List` core module as `List.head`. And let's make this function a `Task` too, as that will ease chaining everything together and allow us to expose an error message when the list is empty:

```haskell
pickFirst : List String -> Task String String
pickFirst logins =
    case List.head logins of
        Just login ->
            Task.succeed login

        Nothing ->
            Task.fail "No events."
```

Note the use of `Task.succeed` and `Task.fail`, which are approximately the Elm equivalents of `Promise.resolve` and `Promise.reject`: this is how you create tasks that succeed or fail immediately.

So in order to chain all the pieces we have so far, we obviously need *glue*. And this glue is the `Task.andThen` function, which can chain our tasks this fancy way:  

```haskell
fetchEvents
    |> Task.andThen pickFirst
    |> Task.andThen fetchName
```

Neat. But wait. As we mentioned previously, Tasks are *descriptions* of side effects, not their actual execution. The `Task.attempt` function will help us doing that, by turning a `Task` into a [Command], provided we define a `Msg` that will be responsible of dealing with the received result:

```haskell
type Msg
    = Name (Result String String)
```

`Result String String` reflects the result of the HTTP request and shares the same type definitions for both the error (a `String`) and the value (the user full name, a `String` too). Let's use this `Msg` with `Task.attempt`:

```haskell
fetchEvents
    |> Task.andThen pickFirst
    |> Task.andThen fetchName
    |> Task.attempt Name
```

Here:

- We start by fetching all the events,
- Then if the Task succeeds, we pick the first event,
- Then if we have one, we fetch the event's user full name,
- And we map the future result of this task to the `Name` message.

The cool thing here is that if anything fails along the chain, the chain stops and the error will be propagated down to the `Name` handler. No need to check errors for each operation! Yes, that looks a lot like how JavaScript Promises' `.catch` works.

Now, how are we going to execute the resulting command and process the result? We need to setup the [Elm Architecture] and its good old `update` function:

```haskell
module Main exposing (main)

import Html exposing (..)
import Http
import Json.Decode as Decode
import Task exposing (Task)


type alias Model =
    { name : Maybe String
    , error : String
    }

type Msg
    = Name (Result String String)

eventsRequest : Http.Request (List String)
eventsRequest =
    Http.get "https://api.github.com/events"
        (Decode.list (Decode.at [ "actor", "login" ] Decode.string))

nameRequest : String -> Http.Request String
nameRequest login =
    Http.get ("https://api.github.com/users/" ++ login)
        (Decode.at [ "name" ]
            (Decode.oneOf
                [ Decode.string
                , Decode.null "unspecified"
                ]
            )
        )

toHttpTask : Http.Request a -> Task String a
toHttpTask request =
    request
        |> Http.toTask
        |> Task.mapError toString

fetchEvents : Task String (List String)
fetchEvents =
    toHttpTask eventsRequest

fetchName : String -> Task String String
fetchName login =
    toHttpTask (nameRequest login)

pickFirst : List String -> Task String String
pickFirst events =
    case List.head events of
        Just event ->
            Task.succeed event

        Nothing ->
            Task.fail "No events."

init : ( Model, Cmd Msg )
init =
    { name = Nothing, error = "" }
        ! [ fetchEvents
                |> Task.andThen pickFirst
                |> Task.andThen fetchName
                |> Task.attempt Name
          ]

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Name (Ok name) ->
            { model | name = Just name } ! []

        Name (Err error) ->
            { model | error = error } ! []

view : Model -> Html Msg
view model =
    div []
        [ if model.error /= "" then
            div []
                [ h4 [] [ text "Error encountered" ]
                , pre [] [ text model.error ]
                ]
          else
            text ""
        , p [] [ text <| Maybe.withDefault "Fetching..." model.name ]
        ]

main =
    Html.program
        { init = init
        , update = update
        , subscriptions = always Sub.none
        , view = view
        }
```

That's for sure more code than with the JavaScript example, but don't forget that the Elm version renders HTML, not just logs in the console, and that the JavaScript code could be refactored to look a lot like the Elm version. Also the Elm version is fully typed and *safeguarded* against unforeseen problems, which makes a huge difference when your application grows.

As always, an [Ellie](https://ellie-app.com/7Q9svdqRGa1/3) is publicly available so you can play around with the code.

[Command]: https://www.elm-tutorial.org/en/03-subs-cmds/02-commands.html
[Elm Architecture]: https://guide.elm-lang.org/architecture/
[Elm commands]: https://www.elm-tutorial.org/en/03-subs-cmds/02-commands.html
[Generic Types]: https://guide.elm-lang.org/types/union_types.html#generic-data-structures
[Http]: http://package.elm-lang.org/packages/elm-lang/http/latest/Http
[how to read Elm function signatures]: https://github.com/knledg/elm-training/blob/master/training/2-primer/2.6-type-signatures.md
[Result]: http://package.elm-lang.org/packages/elm-lang/core/latest/Result
[Task]: http://package.elm-lang.org/packages/elm-lang/core/latest/Task
