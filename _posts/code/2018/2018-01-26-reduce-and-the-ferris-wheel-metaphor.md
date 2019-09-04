---
title: Reduce and the Ferris wheel metaphor
excerpt: I recently had to introduce some Elm concepts to a coworker who had some experience with React and Redux. One of these concepts was List.foldl, a reduction function which exists in many languages, specifically as Array#reduce in JavaScript.
date: 2018-01-26
category: code
tags: elm programming webdev frontend
origin:
  name: Allo-Media Tech blog
  url: https://tech.allo-media.net/learning/elm/2018/01/26/reduce-and-the-ferris-wheel-metaphor.html
---

This is a short anecddote about how I approached teaching things to someone else.

I recently had to introduce some [Elm] concepts to a coworker who had some experience with [React] and [Redux]. One of these concepts was [List.foldl], a reduction function which exists in many languages, specifically as [Array#reduce] in JavaScript.

The coworker was struggling to understand the whole concept, so I tried to use a metaphor; I came with the idea of a [Ferris wheel] next to a lake, with someone in one of its basket holding a bucket, filling the basket with water from the lake everytime the basket is back to the ground.

<a href="https://www.flickr.com/photos/45909111@N00/3812448452/in/photolist-6NTPpE-6NTN6S-8VeQqf-6NTMNw-fmHhYZ-fmHg7k-atTbFs-8VeK2S-atQvRT-6NTKw1-aUDvNP-7dfSYz-2XhKZV-fmXsCG-fmXscE-4sTcSG-8VeBij-fmHhsP-wMJMfg-wuBR7h-wuKc1H-wuBTjf-vQdnbN-wMeCvV-wMJKda-NoBSUY-NvJoFw-MAWVsx-NoBSPC-NoBSxL-NvJoKE-NoBSJY-NvJoFb-NoBSFw-NvJoBJ-MAWP4F-NvJqem-MAWvqe-NvJoHW-MAWv1M-NvJoMd-MAWvcP-vQmVTV-NyVKgD-wuKeKk-wuKdhF-wuBQ57-8VePww-8VbGbk-8Vbz14/" title="Gwydion M. Williams - View of Wuxi from Lake Tai">
    <img src="https://farm3.staticflickr.com/2509/3812448452_c6ecd0424f_z.jpg"
    width="640" height="463" alt="Gwydion M. Williams - View of Wuxi from Lake Tai">
</a>

Yeah, I know.

So as he was starring at me like I was a crazy person, and as I knew he did use React and Redux in the past, I told him it was like the [*reducer functions*](https://redux.js.org/docs/basics/Reducers.html) he probably used already.

We started writing a standard Redux reducer in plain js:

{% highlight javascript %}
function reducer(state, action) {
    switch(action.type) {
        case "EMPTY": {
            return init
        }
        case "ADD_WATER": {
            return {...state, water: state.water + 1}
        }
    }
}
{% endhighlight %}

He was like "oh yeah, I know that". Good! We could use that function iteratively:

{% highlight javascript %}
// Step by step state building
const init = {water: 0}
let state = init
state = reducer(state, {type: "ADD_WATER"})
state = reducer(state, {type: "EMPTY"})
state = reducer(state, {type: "ADD_WATER"})
state = reducer(state, {type: "ADD_WATER"})

console.log(state) // {water: 2}
{% endhighlight %}

Or using `Array#reduce`:

{% highlight javascript %}
// Using Array#reduce and an array of actions
const actions = [
    {type: "ADD_WATER"},
    {type: "EMPTY"},
    {type: "ADD_WATER"},
    {type: "ADD_WATER"},
]

const init = {water: 0}
const state = actions.reduce(reducer, init)
console.log(state) // {water: 2}
{% endhighlight %}

So I could use the Ferris wheel metaphor again:

- `state` represents the state of the wheel basket (and the quantity of water in it)
- `init` is the initial state of the wheel basket (it contains no water yet)
- `actions` are the list of operations to proceed each time the basket reaches the ground again (here, filling the basket with water from the lake, sometimes emptying the basket)

For the records, yes my coworker was still very oddly looking at me.

We moved on and decided to reimplement the same thing in Elm, using `foldl`. Its type signature is:

{% highlight haskell %}
foldl : (a -> b -> b) -> b -> List a -> b
{% endhighlight %}

Wow, that looks complicated, especially when you're new to Elm.

In Elm, type signatures separate each function arguments and the return value with an arrow (<code style="white-space: nowrap">-></code>); so, let's decompose the one for `foldl`:

- `(a -> b -> b)`, the first argument, means we want a function, taking two arguments typed `a` and `b` and returning a `b`. That sounds a lot like our `reducer` function in JavaScript! If so, `a` is an action, and `b` a state.
- the next argument, typed as `b`, is the initial state we start reducing our list of actions from.
- the next argument, `List a`, is our list of actions.
- And all this must return a `b`, hence a new state. We have the exact definition of what we're after.

Actually our own use of `foldl` would have been much more obvious if we initially saw this, replacing `a` by `Action` and `b` by `State`:

{% highlight haskell %}
foldl : (Action -> State -> State) -> State -> List Action -> State
{% endhighlight %}

> Note: if you're still struggling with these `a` and `b`s, you should probably read a little about [Generic Types].

Our resulting minimalistic implementation was:

{% highlight haskell %}
type Action
    = AddWater
    | Empty

type alias State =
    { water : Int }

init : State
init =
    { water = 0 }

actions : List Action
actions =
    [ AddWater
    , Empty
    , AddWater
    , AddWater
    ]

reducer : Action -> State -> State
reducer action state =
    case action of
        Empty ->
            init

        AddWater ->
            { state | water = state.water + 1 }

main =
    div []
        [ -- Step by step state building, renders { water = 2 }
          init
            |> reducer AddWater
            |> reducer Empty
            |> reducer AddWater
            |> reducer AddWater
            |> toString >> text

        -- Using List.foldl, renders { water = 2 }
        , List.foldl reducer init actions
            |> toString >> text
        ]
{% endhighlight %}

We quickly drafted this [on Ellie](https://ellie-app.com/kL3dJS7Gta1/4). It's not graphically impressive, but it works.

That was it, it was more obvious how to map things my coworker already knew to something new to him, while in fact it was actually exactly the same thing, expressed slightly differently from a syntax perspective.

We also expanded that the [Elm Architecture] and the traditional `update` function was basically a projection of `foldl`, `Action` being usually named *Msg* and `State` *Model*.

The funny thing being, Redux design itself was initially inspired by the Elm Architecture!

In conclusion, here are quick takeaways when facing something difficult to understand:

- start with **finding a metaphor**, even a silly one; that helps summarizing the problem, expressing your goal and ensure you get the big picture of it;
- **slice the problem down to the smallest understandable chunks** you can, then move to the next larger one when you're done;
- always try to **map what you're trying to learn to things you've already learned**; past experiences are good tools for that.

[Array#reduce]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
[Elm]: http://elm-lang.org/
[Elm Architecture]: https://guide.elm-lang.org/architecture/
[Ferris wheel]: https://en.wikipedia.org/wiki/Ferris_wheel
[Generic Types]: https://guide.elm-lang.org/types/union_types.html#generic-data-structures
[List.foldl]: http://package.elm-lang.org/packages/elm-lang/core/latest/List#foldl
[React]: https://reactjs.org/
[Redux]: https://redux.js.org/
