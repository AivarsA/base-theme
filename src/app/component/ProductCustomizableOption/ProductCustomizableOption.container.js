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

import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from 'Util/Price';
import ProductCustomizableOption from './ProductCustomizableOption.component';

class ProductCustomizableOptionContainer extends PureComponent {
    static propTypes = {
        option: PropTypes.object.isRequired,
        setSelectedCheckboxValues: PropTypes.func.isRequired,
        setCustomizableOptionTextFieldValue: PropTypes.func.isRequired,
        setSelectedDropdownValue: PropTypes.func.isRequired,
        setSelectedFileValues: PropTypes.func.isRequired
    };

    state = {
        textValue: '',
        selectedDropdownValue: 0,
        files: []
    };

    containerFunctions = {
        getDropdownOptions: this.getDropdownOptions.bind(this),
        getSelectedCheckboxValue: this.getSelectedCheckboxValue.bind(this),
        updateTextFieldValue: this.updateTextFieldValue.bind(this),
        setDropdownValue: this.setDropdownValue.bind(this),
        renderOptionLabel: this.renderOptionLabel.bind(this),
        handleAttachFile: this.onFileAttach.bind(this),
        handleRemoveFile: this.handleRemoveFile.bind(this)
    };

    constructor(props) {
        super(props);

        this.fileFormRef = createRef();
    }

    containerProps = () => ({
        optionType: this.getOptionType(),
        fileFormRef: this.fileFormRef
    });

    getOptionType() {
        const { option } = this.props;
        const { type } = option;

        return type;
    }

    renderOptionLabel(priceType, price) {
        switch (priceType) {
        case 'PERCENT':
            return `${ price }%`;
        default:
            return `${ formatCurrency() }${ price }`;
        }
    }

    getSelectedCheckboxValue(value) {
        const { option, setSelectedCheckboxValues } = this.props;
        const { option_id } = option;

        setSelectedCheckboxValues(option_id, value);
    }

    updateTextFieldValue(value) {
        const { option, setCustomizableOptionTextFieldValue } = this.props;
        const { option_id } = option;

        setCustomizableOptionTextFieldValue(option_id, value);
        this.setState({ fieldValue: value });
    }

    setDropdownValue(value) {
        const { setSelectedDropdownValue, option } = this.props;
        const { selectedDropdownValue } = this.state;

        if (selectedDropdownValue === value) {
            setSelectedDropdownValue(null, option);
            this.setState({ selectedDropdownValue: 0 });
        } else {
            setSelectedDropdownValue(value, option);
            this.setState({ selectedDropdownValue: parseInt(value, 10) });
        }
    }

    getDropdownOptions(values) {
        return values.reduce((acc, {
            option_type_id, title, price, price_type
        }) => {
            acc.push({
                id: option_type_id,
                name: title,
                value: option_type_id,
                label: `${title} + ${this.renderOptionLabel(price_type, price)}`
            });

            return acc;
        }, []);
    }

    onFileAttach() {
        const { files } = this.state;
        const filesFromForm = this.fileFormRef.current.files || [];
        // const { max_file_size, setSelectedFileValues } = this.props;
        const { setSelectedFileValues, option } = this.props;
        const oldFiles = [].concat(files);

        const newFiles = Object.values(filesFromForm).reduce(
            /** @param acc
             * @param {File} file */
            (acc, file) => {
                // Handle file size more than max allowed
                // But first transform from b to Kb
                // if (file.size / 1024 > max_file_size) {
                //     showNotification('error', __(
                //         'File %s has exceeded the maximum file size limit of %s KB',
                //         file.name,
                //         max_file_size
                //     ));
                //
                //     return acc;
                // }

                acc.push(file);
                return acc;
            }, oldFiles
        );

        setSelectedFileValues(newFiles, option);
        this.setState(() => ({ files: newFiles }));
    }

    handleRemoveFile(name) {
        const { setSelectedFileValues, option } = this.props;
        const { files } = this.state;

        const newFiles = files.reduce(
            (acc, file) => {
                if (file.name !== name) {
                    acc.push(file);
                }

                return acc;
            }, []
        );

        setSelectedFileValues(newFiles, option);
        this.setState(() => ({ files: newFiles }));
    }

    render() {
        return (
            <ProductCustomizableOption
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default ProductCustomizableOptionContainer;
