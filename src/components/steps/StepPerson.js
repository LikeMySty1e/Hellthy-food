import React from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react-lite";
import Input, {InputType} from "../common/Input";
import {ButtonDirection} from "../common/buttons/RoundButton";
import Checkbox from "../common/Checkbox/Checkbox";
import {useValidation} from "../../hooks/useValidation";
import {isNull, isValid} from "../../helpers/checkIsHelper";
import GenderEnum from "../../enums/GenderEnum";
import Autocomplete from "../common/Autocomplete/Autocomplete";
import {ReactComponent as PersonIcon} from "../../icons/common/person.m.svg";
import profResource from "../../resources/profResource";
import CommonStep from "./CommonStep";
import GoalEnum from "../../enums/GoalEnum";

const StepPerson = observer(props => {
    const {
        data,
        isEdit,
        showIcon,
        updateData
    } = props;
    const {
        gender,
        profession,
        goal,
        name,
        weight,
        height,
        age
    } = data;
    const [isNameValid, validateName] = useValidation(name,true, isValid);
    const [isWeightValid, validateWeight] = useValidation(weight,true, isValid);
    const [isHeightValid, validateHeight] = useValidation(height,true, isValid);
    const [isProfessionValid, validateProfession] = useValidation(profession,true, isValid);
    const [isAgeValid, validateAge] = useValidation(age,true, isValid);

    const stepFilled = React.useMemo(() => isValid({
        gender: !isNull(gender),
        profession,
        name,
        weight,
        height,
        age,
        goal: !isNull(goal),
        isProfessionValid,
        isNameValid,
        isWeightValid,
        isHeightValid,
        isAgeValid
    }), [gender, name, weight, height, age, goal, profession]);

    const onSet = (value, field, validation) => {
        validation && validation(value);
        updateData({ [field]: value });
    };

    const renderParameters = () => {
        return <div className="step__row">
            <Input
                type={InputType.numbers}
                value={height}
                maxLength={3}
                classname="step__input--small"
                style={{ marginBottom: 0 }}
                label={"Рост (см)"}
                error={!isHeightValid}
                onChange={value => onSet(value, `height`, validateHeight)}
            />
            <Input
                type={InputType.numbers}
                value={weight}
                maxLength={3}
                classname="step__input--small"
                style={{ marginBottom: 0 }}
                label={"Вес (кг)"}
                error={!isWeightValid}
                onChange={value => onSet(value, `weight`, validateWeight)}
            />
            <Input
                type={InputType.numbers}
                value={age}
                maxLength={2}
                style={{ marginBottom: 0 }}
                label={"Возраст (лет)"}
                error={!isAgeValid}
                message={!isAgeValid ? `Введено недопустимое значение` : ``}
                onChange={value => onSet(value, `age`, validateAge)}
            />
        </div>;
    };

    const rendergoal = () => {
        return <React.Fragment>
            Ваша цель<br />
            <div className="step__row">
                <Checkbox
                    value={goal === GoalEnum.weightLoss}
                    classname="step__checkbox"
                    onChange={() => updateData({ goal: GoalEnum.weightLoss })}
                >
                    <span className="green">Сбросить</span>
                </Checkbox>
                <Checkbox
                    value={goal === GoalEnum.keep}
                    classname="step__checkbox"
                    onChange={() => updateData({ goal: GoalEnum.keep })}
                >
                    <span className="green">Поддерживать</span>
                </Checkbox>
                <Checkbox
                    value={goal === GoalEnum.training}
                    classname="step__checkbox"
                    onChange={() => updateData({ goal: GoalEnum.training })}
                >
                    <span className="green">Тренироваться</span>
                </Checkbox>
            </div><br />
        </React.Fragment>;
    };

    const renderGender = () => {
        return <React.Fragment>
            <div className="step__row">
                <Checkbox
                    value={gender === GenderEnum.man}
                    classname="step__checkbox"
                    onChange={() => updateData({ gender: gender === GenderEnum.man ? GenderEnum.women : GenderEnum.man })}
                >
                    <span className="green">Мужчина</span>
                </Checkbox>
                <Checkbox
                    value={gender === GenderEnum.women}
                    classname="step__checkbox"
                    onChange={() => updateData({ gender: gender === GenderEnum.women ? GenderEnum.man :GenderEnum.women })}
                >
                    <span className="green">Женщина</span>
                </Checkbox>
            </div><br />
        </React.Fragment>;
    };

    return <CommonStep
        {...props}
        Icon={(isEdit && showIcon) ? PersonIcon : null}
        stepFilled={stepFilled}
        direction={ButtonDirection.bottomLeft}
    >
        <div className="orange__title">О вашем персонаже</div>
        {!isEdit && <React.Fragment>
            Мы спрашиваем ваш рост, вес, возраст, цель и профессию, чтобы понимать,
            сколько калорий вам нужно потреблять в день, какие пищевые группы вам следует увеличить или
            уменьшить в рационе, и какой тип питания будет наиболее эффективным для вас.<br /><br />
        </React.Fragment>}
        <Input
            value={name}
            label={"Имя"}
            error={!isNameValid}
            message={!isNameValid ? `Имя не может быть пустым` : ``}
            onChange={value => onSet(value, `name`, validateName)}
        />
        {renderParameters()}
        {renderGender()}
        <Autocomplete
            label={`Профессия`}
            selected={profession?.value}
            data={profResource}
            error={!isProfessionValid}
            message={!isProfessionValid ? `Введите корректное название профессии` : ``}
            onSelect={selected => onSet(selected, `profession`, validateProfession)}
        />
        {rendergoal()}
    </CommonStep>
});

StepPerson.propTypes = {
    isEdit: PropTypes.bool,
    classname: PropTypes.string,
    isLast: PropTypes.bool,
    index: PropTypes.number,
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    hide: PropTypes.bool,
    pushStep: PropTypes.func
};

export default StepPerson;