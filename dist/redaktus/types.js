// Redaktus Types - собственные типы без зависимости от react-bricks
export var types;
(function (types) {
    let SideEditPropType;
    (function (SideEditPropType) {
        SideEditPropType["Text"] = "TEXT";
        SideEditPropType["Textarea"] = "TEXTAREA";
        SideEditPropType["Number"] = "NUMBER";
        SideEditPropType["Boolean"] = "BOOLEAN";
        SideEditPropType["Select"] = "SELECT";
        SideEditPropType["Color"] = "COLOR";
        SideEditPropType["Image"] = "IMAGE";
        SideEditPropType["RichText"] = "RICHTEXT";
        SideEditPropType["Repeater"] = "REPEATER";
        SideEditPropType["Date"] = "DATE";
        SideEditPropType["Custom"] = "CUSTOM";
    })(SideEditPropType = types.SideEditPropType || (types.SideEditPropType = {}));
    let OptionsDisplay;
    (function (OptionsDisplay) {
        OptionsDisplay["Dropdown"] = "dropdown";
        OptionsDisplay["Radio"] = "radio";
        OptionsDisplay["Buttons"] = "buttons";
        OptionsDisplay["Select"] = "select";
    })(OptionsDisplay = types.OptionsDisplay || (types.OptionsDisplay = {}));
    let CustomFieldType;
    (function (CustomFieldType) {
        CustomFieldType["Text"] = "text";
        CustomFieldType["Number"] = "number";
        CustomFieldType["Boolean"] = "boolean";
        CustomFieldType["Date"] = "date";
        CustomFieldType["Image"] = "image";
        CustomFieldType["Reference"] = "reference";
    })(CustomFieldType = types.CustomFieldType || (types.CustomFieldType = {}));
    let ClickToEditSide;
    (function (ClickToEditSide) {
        ClickToEditSide["BottomLeft"] = "bottom-left";
        ClickToEditSide["BottomRight"] = "bottom-right";
        ClickToEditSide["TopLeft"] = "top-left";
        ClickToEditSide["TopRight"] = "top-right";
    })(ClickToEditSide = types.ClickToEditSide || (types.ClickToEditSide = {}));
    let DeviceType;
    (function (DeviceType) {
        DeviceType["Phone"] = "phone";
        DeviceType["Tablet"] = "tablet";
        DeviceType["Desktop"] = "desktop";
    })(DeviceType = types.DeviceType || (types.DeviceType = {}));
    let BlockIconsPosition;
    (function (BlockIconsPosition) {
        BlockIconsPosition["OutsideBlock"] = "outside-block";
        BlockIconsPosition["InsideBlock"] = "inside-block";
    })(BlockIconsPosition = types.BlockIconsPosition || (types.BlockIconsPosition = {}));
    let PageStatus;
    (function (PageStatus) {
        PageStatus["Published"] = "published";
        PageStatus["Draft"] = "draft";
        PageStatus["Private"] = "private";
    })(PageStatus = types.PageStatus || (types.PageStatus = {}));
    // RichText Features для совместимости
    types.RichTextFeatures = {
        Bold: 'bold',
        Italic: 'italic',
        Underline: 'underline',
        Strikethrough: 'strikethrough',
        Code: 'code',
        Link: 'link',
        Unlink: 'unlink',
        BulletList: 'bullet-list',
        NumberedList: 'numbered-list',
        Quote: 'quote',
        Heading1: 'heading-1',
        Heading2: 'heading-2',
        Heading3: 'heading-3',
        Heading4: 'heading-4',
        Heading5: 'heading-5',
        Heading6: 'heading-6'
    };
})(types || (types = {}));
//# sourceMappingURL=types.js.map