---
title: Elm Result Pipeline
lang: en
date: 2021-10-21
category: Code
tags: work webdev elm programming
redirect_from:
  - /carnet/2021/elm-result-pipeline/
image: /static/code/2021/pipeline.jpg
---

One of the best features of pure functional programming languages like [Elm](https://elm-lang.org/) is their ability to deal with and handle *uncertainty*. The absence of `null` and exceptions forces developers to state explicitely what should happen when expectations aren't met, which combined with a good compiler and a strong static type system makes the code super descriptive and rock solid.

A classic example is when you query a data structure which can be empty:

```elm
> dogs = [ "Lassie", "Scooby-Doo" ]
["Lassie","Scooby-Doo"] : List String


> dogs |> List.head
Just "Lassie" : Maybe String


> dogs = []
[] : List a


> dogs |> List.head
Nothing : Maybe a
```

Meaning you may handle [`Maybe`](https://package.elm-lang.org/packages/elm/core/latest/Maybe), `Maybe.map`, `Maybe.andThen`, `Maybe.withDefault` and so on if you want to ensure you handle the uncertainty of actually holding a value:

```elm
> ["Lassie"]
    |> List.head
    |> Maybe.map String.toUpper
    |> Maybe.withDefault "oh no ;("
"LASSIE" : String


> []
    |> List.head
    |> Maybe.map String.toUpper
    |> Maybe.withDefault "oh no ;("
"oh no ;(" : String
```

Same goes with [`Result`](https://package.elm-lang.org/packages/elm/core/latest/Result), which is basically a `Maybe` with an alternative value — typically an error — attached:

```elm
> findDog name =
    List.filter ((==) name)
      >> List.head
      >> Result.fromMaybe ("oh no, can't find " ++ name)
<function> : String -> List String -> Result String String


> ["Lassie", "Scooby-Doo"]
    |> findDog "Scooby-Doo"
Ok "Scooby-Doo" : Result String String


> ["Lassie", "Scooby-Doo"]
    |> findDog "Rintintin"
Err ("oh no, can't find Rintintin") : Result String String
```

So really, `Result` is super useful. Now it's *so* useful that sometimes, you want to use it *a lot*, eg. in records:

```elm
type alias Dog = String
type alias Error = String

type alias FavoriteDogs =
    { dogSlot1 : Result Error Dog
    , dogSlot2 : Result Error Dog
    , dogSlot3 : Result Error Dog
    , dogSlot4 : Result Error Dog
    , dogSlot5 : Result Error Dog
    , dogSlot6 : Result Error Dog
    }
```

> **Heads up!**
>
> For the sake of simplicity and disambiguation, we're aliasing `Dog`
> and `Error` as strings here. This is not recommended practice, you should rather
> use [opaque types](https://ckoster22.medium.com/advanced-types-in-elm-opaque-types-ec5ec3b84ed2) instead.

Hmm wait, imagine you're only interested in a `FavoriteDogs` record when all six available slots are fulfilled. Checking for this is going to be painful:

```elm
showDogs : FavoriteDogs -> Html msg
showDogs favorites =
    case favorites.dogSlot1 of
        Ok dog1 ->
            case favorites.dogSlot2 of
                Ok dog2 ->
                    case dogSlot2 of
                        Ok dog2 ->
                            -- To be continued… At some point
                            -- we can use dog1, dog2 -> dog6

                        Err error ->
                            Html.text error

                Err error ->
                    Html.text error

        Err error ->
            Html.text error
```

Luckily we have the [`Result.map`](https://package.elm-lang.org/packages/elm/core/latest/Result#map) familly of functions:

```elm
firstTwoDogs : FavoriteDogs -> Result Error Dog
firstTwoDogs { dogSlot1, dogSlot2 } =
    Result.map2
        (\dog1 dog2 -> dog1 ++ " and " ++ dog2)
        dogSlot1
        dogSlot2


firstThreeDogs : FavoriteDogs -> Result Error Dog
firstThreeDogs { dogSlot1, dogSlot2, dogSlot3 } =
    Result.map3
        (\dog1 dog2 dog3 ->
            String.join ", " [ dog1, dog2, dog3 ]
        )
        dogSlot1
        dogSlot2
        dogSlot3
```

But wait, we don't have `Result.map6`! The core implementation of [`Result.map5`](https://github.com/elm/core/blob/47ebbc97047d92baa72d877a478afaaea3aefce8/src/Result.elm#L143-L170) is pretty verbose already, I can understand why they avoided going further haha. But more annoyingly, that means you don't have a convenient helper for mapping more than 5 `Result`s at once, for example to build a record having 6.

Also, ideally we'd rather want to deal with a data structure with direct access, to avoid messing around too much with the `Result` api:

```elm
type alias FavoriteDogs =
    { dogSlot1 : Dog
    , dogSlot2 : Dog
    , dogSlot3 : Dog
    , dogSlot4 : Dog
    , dogSlot5 : Dog
    , dogSlot6 : Dog
    }
```

## Pipelining to the rescue!

Here's a convenient helper I use to build a record using the [pipeline builder pattern](https://sporto.github.io/elm-patterns/advanced/pipeline-builder.html); it's often known in functional languages as `apply`, but I like `resolve`:

```elm
resolve : Result x a -> Result x (a -> b) -> Result x b
resolve result =
    Result.andThen (\partial -> Result.map partial result)
```

It allows creating a fully-qualified `FavoriteDogs` record this way:

```elm
build : Result Error FavoriteDogs
build =
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Trakr" dogs)
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)
```

You might have already seen this pattern used in the popular [elm-json-decode-pipeline](https://package.elm-lang.org/packages/NoRedInk/elm-json-decode-pipeline/latest) package.

<figure>
    <img src="/static/code/2021/pipeline.jpg" alt="Photo of Pipelines" style="width:100%;border-radius:5px">
    <figcaption>
        Photo by <a href="https://unsplash.com/@sigmund">Sigmund</a> on <a href="https://unsplash.com/s/photos/pipeline">Unsplash</a>
    </figcaption>
</figure>

The cool thing with this approach is that if a single result fails, the whole operation fails with the error of the first failure encountered during the build process:

```elm
dogs : List Dog
dogs =
    [ "Lassie", "Toto", "Trakr", "Laïka", "Balto", "Jofi" ]


findDog : Dog -> List Dog -> Result Error Dog
findDog name =
    List.filter ((==) name)
        >> List.head
        >> Result.fromMaybe ("oh no, can't find " ++ name)


type alias FavoriteDogs =
    { dogSlot1 : Dog
    , dogSlot2 : Dog
    , dogSlot3 : Dog
    , dogSlot4 : Dog
    , dogSlot5 : Dog
    , dogSlot6 : Dog
    }


buildOk : Result Error FavoriteDogs
buildOk =
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Trakr" dogs)
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)
    -- Gives:
    --   Ok
    --     { dogSlot1 = "Lassie"
    --     , dogSlot2 = "Toto"
    --     , dogSlot3 = "Trakr"
    --     , dogSlot4 = "Laïka"
    --     , dogSlot5 = "Balto"
    --     , dogSlot6 = "Jofi"
    --     }


buildErr : Result Error FavoriteDogs
buildErr =
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Garfield" dogs) -- woops!
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)
    -- Gives:
    --   Err ("oh no, can't find Garfield")
```

That's all folks, hope it's useful.

## Disclaimer

This post has been written in ~~one hour tops~~ more than that with all the feeddback received. This is an attempt at forcing myself to write again on this blog, just don't judge me too harsh!

## Thanks

Thanks to [Ethan](https://github.com/glasserc), [Mathieu](https://blog.mathieu-leplatre.info/), [Mathieu](https://agopian.info/) and [Rémy](https://twitter.com/Natim) for their precious feedback.

## Update

Thanks to [elm-search](https://klaftertief.github.io/elm-search/?q=Result%20x%20a%20-%3E%20Result%20x%20(a%20-%3E%20b)%20-%3E%20Result%20x%20b), I could find that the [elm-result-extra](https://package.elm-lang.org/packages/elm-community/result-extra/latest) package provides [`andMap`](https://package.elm-lang.org/packages/elm-community/result-extra/latest/Result-Extra#andMap), which allows exactly the same thing as my `resolve` helper.
