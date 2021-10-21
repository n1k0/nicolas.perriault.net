---
title: Elm Result Pipeline
lang: en
date: 2021-10-21
category: carnet
tags: work webdev elm
image:
---

[Elm](https://elm-lang.org/) is great, but let's admit it: dealing with incertainty can be painful. A classic example is when you query a data structure which can be empty:

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

Meaning you have to handle `Maybe`, `Maybe.map`, `Maybe.andThen`, `Maybe.withDefault` and so on if you want to ensure you handle the uncertainty of actually holding a value:

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

Same goes with `Result`, which is basically a `Maybe` with an explicit error attached:

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

So really, `Result`s are super useful. Now they're so useful that sometimes, you want to use them a lot, eg in a record:

```elm
type alias FavoriteDogs = {
    dogSlot1: Result String String
  , dogSlot2: Result String String
  , dogSlot3: Result String String
  , dogSlot4: Result String String
  , dogSlot5: Result String String
  , dogSlot6: Result String String
}
```

Hmm wait, checking for these results every time we need a value is gonna be painful:

```elm
div []
    [ text "I like "
    , case dogSlot1 of
        Ok dog2 ->
            text <| dog2 ++ ", "

        Err error ->
            text error
    , case dogSlot2 of
        Ok dog2 ->
            text <| dog2 ++ ", "

        Err error ->
            text error

    -- etc…
    , text "and that's it."
    ]
```

Hopefully we have the `Result.map` familly of functions:

```elm
div []
    [ text "I like "
    , Result.map2
        (\dog1 dog2 -> text <| dog1 ++ ", " ++ dog2)
        dogSlot1
        dogSlot2

    -- etc…
    , text "and that's it"
    ]
```

But wait, we don't have `map6`! The core implementation of [Result.map5](https://github.com/elm/core/blob/47ebbc97047d92baa72d877a478afaaea3aefce8/src/Result.elm#L143-L170) is pretty verbose, I understand they avoided going further haha. But more annoyingly, that means you don't have a convenient helper for mapping more than 5 `Result`s at once, for example to build a record having 6.

Also, ideally we'd rather want to deal with a data structure with direct access, to avoid messing around too much with the `Result` api:

```elm
type alias FavoriteDogs = {
    dogSlot1: String
  , dogSlot2: String
  , dogSlot3: String
  , dogSlot4: String
  , dogSlot5: String
  , dogSlot6: String
}
```

Here's a nice helper I wrote allowing to compose a record using the [pipeline builder pattern](https://sporto.github.io/elm-patterns/advanced/pipeline-builder.html):


```elm
resolve : Result x a -> Result x (a -> b) -> Result x b
resolve result =
    Result.andThen (\partial -> Result.map partial result)
```

It allows creating a fully-qualified `FavoriteDogs` record this way:

```elm
build : Result String FavoriteDogs
build =
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Trakr" dogs)
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)
```

The cool thing being that if a single result fails, the whole operation fails with the error of the first failure encountered during the build process:

```elm
dogs : List String
dogs =
    [ "Lassie", "Toto", "Trakr", "Laïka", "Balto", "Jofi" ]


findDog : String -> List String -> Result String String
findDog name =
    List.filter ((==) name)
        >> List.head
        >> Result.fromMaybe ("oh no, can't find " ++ name)


type alias FavoriteDogs =
    { dogSlot1 : String
    , dogSlot2 : String
    , dogSlot3 : String
    , dogSlot4 : String
    , dogSlot5 : String
    , dogSlot6 : String
    }


buildOk : Result String FavoriteDogs
buildOk =
    -- Gives:
    --   Ok
    --     { dogSlot1 = "Lassie"
    --     , dogSlot2 = "Toto"
    --     , dogSlot3 = "Trakr"
    --     , dogSlot4 = "Laïka"
    --     , dogSlot5 = "Balto"
    --     , dogSlot6 = "Jofi"
    --     }
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Trakr" dogs)
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)


buildErr : Result String FavoriteDogs
buildErr =
    -- Gives:
    --   Err ("oh no, can't find Garfield")
    Ok FavoriteDogs
        |> resolve (findDog "Lassie" dogs)
        |> resolve (findDog "Toto" dogs)
        |> resolve (findDog "Garfield" dogs)
        |> resolve (findDog "Laïka" dogs)
        |> resolve (findDog "Balto" dogs)
        |> resolve (findDog "Jofi" dogs)
```

That's all folks, hope it's useful.

### Disclaimer

This post has been written in an hour tops. This is an attempt at forcing myself writing again on this blog, just don't judge me too harsh!
