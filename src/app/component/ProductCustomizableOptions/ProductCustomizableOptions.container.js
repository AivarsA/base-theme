/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { OptionsType } from 'Type/ProductList';
import ProductCustomizableOptions from './ProductCustomizableOptions.component';

export const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

export const encodeFormFiles = async filesFromForm => Object.values(filesFromForm).reduce(
    async (previousPromise, file) => {
        const acc = await previousPromise;
        acc.push({
            name: file.name,
            encoded_file: await fileToBase64(file)
        });

        return acc;
    }, Promise.resolve([])
);

class ProductCustomizableOptionsContainer extends PureComponent {
    static propTypes = {
        options: OptionsType,
        getSelectedCustomizableOptions: PropTypes.func.isRequired
    };

    static defaultProps = {
        options: []
    };

    state = {
        isLoading: true,
        selectedCheckboxValues: [],
        selectedDropdownOptions: [],
        textFieldValues: [],
        files: []
    };

    containerFunctions = {
        setSelectedDropdownValue: this.setSelectedDropdownValue.bind(this),
        setSelectedCheckboxValues: this.setSelectedCheckboxValues.bind(this),
        setCustomizableOptionTextFieldValue: this.setCustomizableOptionTextFieldValue.bind(this),
        setSelectedFileValues: this.setSelectedFileValues.bind(this)
    };

    componentDidMount() {
        const { options } = this.props;

        if (options) {
            this.stopLoading();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { options } = this.props;
        const {
            selectedCheckboxValues,
            selectedDropdownOptions,
            textFieldValues,
            files,
            isLoading
        } = this.state;
        const {
            selectedCheckboxValues: prevSelectedCheckboxValues,
            selectedDropdownOptions: prevSelectedDropdownOptions,
            textFieldValues: prevTextFieldValues,
            files: prevFiles
        } = prevState;

        if (options && isLoading) {
            this.stopLoading();
        }

        if (selectedCheckboxValues !== prevSelectedCheckboxValues) {
            this.updateSelectedOptionsArray();
        }

        if (textFieldValues !== prevTextFieldValues
            || selectedDropdownOptions !== prevSelectedDropdownOptions
        ) {
            this.updateSelectedOptions();
        }

        if (files !== prevFiles) {
            this.updateSelectedFiles();
        }
    }

    stopLoading() {
        this.setState({ isLoading: false });
    }

    updateSelectedOptionsArray() {
        const { getSelectedCustomizableOptions } = this.props;
        const { selectedCheckboxValues } = this.state;
        const customizableOptions = [];

        customizableOptions.push(...customizableOptions, ...selectedCheckboxValues);
        getSelectedCustomizableOptions(customizableOptions, true);
    }

    updateSelectedOptions() {
        const { getSelectedCustomizableOptions } = this.props;
        const {
            selectedDropdownOptions,
            textFieldValues
        } = this.state;
        const customizableOptions = [];

        customizableOptions.push(
            ...customizableOptions,
            ...textFieldValues,
            ...selectedDropdownOptions
        );

        getSelectedCustomizableOptions(customizableOptions);
    }

    updateSelectedFiles() {
        const { getSelectedCustomizableOptions } = this.props;
        const { files } = this.state;

        getSelectedCustomizableOptions(files, false, true);
    }

    setCustomizableOptionTextFieldValue(option_id, option_value) {
        const { textFieldValues } = this.state;

        if (!option_value) {
            const filteredOptions = textFieldValues.filter(item => item.option_id !== option_id);
            return this.setState({ textFieldValues: filteredOptions });
        }

        const textFieldValue = { option_id, option_value };

        if (textFieldValues.some(({ option_id: val }) => option_id === val)) {
            const filteredItems = textFieldValues.filter(value => value.option_id !== option_id);
            return this.setState({ textFieldValues: filteredItems.concat(textFieldValue) });
        }

        return this.setState({ textFieldValues: [...textFieldValues, textFieldValue] });
    }

    setSelectedDropdownValue(value, option) {
        const { selectedDropdownOptions } = this.state;
        const { option_id } = option;

        if (!value) {
            const filteredOptions = selectedDropdownOptions.filter(item => item.option_id !== option_id);
            return this.setState({ selectedDropdownOptions: filteredOptions });
        }

        const optionData = { option_id, option_value: value };

        if (selectedDropdownOptions.some(({ option_id: val }) => option_id === val)) {
            const filteredItems = selectedDropdownOptions.filter(value => value.option_id !== option_id);
            return this.setState({ selectedDropdownOptions: filteredItems.concat(optionData) });
        }

        return this.setState({
            selectedDropdownOptions:
                [...selectedDropdownOptions, optionData]
        });
    }

    setSelectedCheckboxValues(option_id, option_value) {
        const { selectedCheckboxValues } = this.state;
        const selectedValue = { option_id, option_value };

        if (selectedCheckboxValues.some(({ option_value: val }) => option_value === val)) {
            return this.setState({
                selectedCheckboxValues: selectedCheckboxValues.filter(value => value.option_value !== option_value)
            });
        }

        return this.setState({
            selectedCheckboxValues: [...selectedCheckboxValues, selectedValue]
        });
    }

    async setSelectedFileValues(filesData, option) {
        const { option_id } = option;
        const selectedFiles = await encodeFormFiles(filesData);
        const files = [];

        files.push({ option_id, files_data: selectedFiles });

        return this.setState({ files });
    }

    render() {
        return (
            <ProductCustomizableOptions
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default ProductCustomizableOptionsContainer;
