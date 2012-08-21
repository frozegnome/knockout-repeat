### **REPEAT** binding for [Knockout](http://knockoutjs.com/)

The `repeat` binding can replace `foreach` in many instances and is faster and simpler for some tasks.
In contrast to `foreach`:

* `repeat` does not create a new binding context. Therefore, the variables for the binding context
    (`$data`, `$parent`, and `$parents`) are unaffected. Instead, you can access the current item using
    `$item()` and `$index`.
* `repeat` operates on the outer HTML instead of the inner HTML.
* `repeat` can either loop a number of times (`count`) or iterate over an array or observableArray (`foreach`).
* `repeat` avoids excessive re-rendering of DOM nodes by updating only the child bindings when the view model changes.

Here�s a comparison between `foreach` and `repeat` for a data table:

```html
<table>
    <tbody data-bind="foreach: data">
        <tr data-bind="foreach: $parent.columns">
            <td data-bind="text: $parent[$data.propertyName]"></td>
        </tr>
    </tbody>
</table>

<table>
    <tbody>
        <tr data-bind="repeat: {foreach: data, item: '$row'}">
            <td data-bind="repeat: {foreach: columns, item: '$col'}"
                data-repeat-bind="text: $row()[$col().propertyName]"></td>
        </tr>
    </tbody>
</table>
```

#### Parameters

`repeat` can take either a single parameter (the number of repetitions [count] or an array to iterate [foreach])
or an object literal with the following properties:

* `count` the number of repetitions
* `foreach` an array or observableArray over which to iterate
   (either *count* or *foreach* is required)
* `index` the name of the property that will store the index (default is `$index`)
* `item` the name of the property used to access the indexed item in the array (default is `$item`)
   (*item* is only used when an array is supplied with *foreach*) `$item` is a pseudo-observable and
   can be passed directly to bindings that accept observables (most do) or the item value can be
   accessed using observable syntax: `$item()`.
* `bind` the binding used for the repeated elements (optional); *index* and *item* will be available
   in this binding. Binding can be either a string or a function (see below) that returns
   an object. If using the function syntax with a array, the first parameter is *item* and the second
   is *index*; with just a count, the only parameter is *index*. The last parameter to the function is
   the context object, which is useful if you want to define your function externally (in your view
   model) and want access to context properties such as `$parent`. The repeated binding can also be
   specified using its own attribute, `data-repeat-bind` (see example above).

#### More Examples

The following will display 01234. This example uses a `bind` function with `index`.

```html
<span data-bind="repeat: {count: 5, bind: function($index) { return { text: $index } } }">
```

The following will display a list of countries with numbering supplied by the repeat binding�s $index. The selected
country will have the `selected` class. This example uses a `bind` function with `item`.

```html
<div data-bind="repeat: {foreach: availableCountries, item: '$country',
    bind: function($country) { return { css: { sel: $country() == selectedCountry() } } } }">
    <span data-bind="text: $index+1"></span>. <span data-bind="text: $country"></span>
</div>
```

This example uses a `bind` string:

```html
<span data-bind="repeat: { count: 5, bind: 'text: $index' }">
```

#### License and Contact

**License:** MIT (http://www.opensource.org/licenses/mit-license.php)

Michael Best<br>
https://github.com/mbest<br>
mbest@dasya.com
