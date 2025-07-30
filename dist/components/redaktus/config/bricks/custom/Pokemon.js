import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as types from 'redaktus/types';
const Pokemon = ({ id, name, height, weight, imageUrl, }) => {
    if (!id || !name || !height || !weight || !imageUrl) {
        return null;
    }
    return (_jsxs("div", { className: "my-6 pb-6 container max-w-3xl mx-auto border-2 border-slate-200", children: [_jsx("div", { className: "p-2 bg-slate-100 mb-6", children: _jsx("p", { className: "text-sm text-slate-700 uppercase tracking-widest font-bold text-center mb-1", children: "Test external data" }) }), _jsx("img", { src: imageUrl, className: "mx-auto w-36 mb-4" }), _jsx("h1", { className: "text-5xl font-extrabold text-center mb-6", children: name }), _jsxs("p", { className: "text-center", children: ["#", id, " - Height ", height / 10, " m - Weight ", weight / 10, " Kg"] })] }));
};
Pokemon.schema = {
    name: 'pokemon',
    label: 'Pokemon',
    // previewImageUrl: `/bricks-preview-images/pokemon.png`,
    getDefaultProps: () => ({}),
    // getExternalData: (page: any, brickProps: any) =>
    //   fetch(`https://pokeapi.co/api/v2/pokemon/${brickProps.pokemonName}`)
    //     .then((response) => response.json())
    //     .then((data) => ({
    //       id: data.id,
    //       name: data.name,
    //       height: data.height,
    //       weight: data.weight,
    //       imageUrl: `https://img.pokemondb.net/artwork/large/${data.name}.jpg`,
    //     }))
    //     .catch((error) => {
    //       return {
    //         id: 0,
    //         name: '',
    //         height: 0,
    //         weight: 0,
    //         imageUrl: '',
    //       }
    //     }),
    // Sidebar Edit controls for props
    sideEditProps: [
        {
            name: 'pokemonName',
            label: 'Pokemon Name',
            type: types.SideEditPropType.Text,
            // helperText: 'Enter a valid Pokemon name, like "pikachu" or "charizard" and save.',
        },
    ],
};
export default Pokemon;
//# sourceMappingURL=Pokemon.js.map