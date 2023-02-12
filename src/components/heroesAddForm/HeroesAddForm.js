import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import {useSelector} from "react-redux";
import {selectAll} from "../heroesFilters/filtersSlice";
import store from "../../store";
import {useCreateHeroMutation} from "../../api/apiSlice";

const HeroesAddForm = () => {
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const [createHero, {isLoading, isError}] = useCreateHeroMutation();

    const addHero = (values) => {
        const newHero = {
            id: uuidv4(),
            ...values
        }
        createHero(newHero);
    }

    const renderFilters = (filters) => {
        if (isLoading) {
            return <option>Загрузка элементов</option>
        } else if (isError) {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <Formik
            initialValues ={{
                name: '',
                text: '',
                element: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .min(2, 'Минимум 2 символа для заполнения')
                    .required('Обязательное поле!'),
                text: Yup.string()
                    .min(2, 'Минимум 2 символа для заполнения')
                    .required('Обязательное поле!'),
                element: Yup.string().required('Выберите элемент')
            })}
            onSubmit = {values => addHero(values)}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Как меня зовут?"/>
                </div>
                <ErrorMessage component="div" style={{'color': 'red'}} name="name"/>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        as="textarea"
                        name="text"
                        className="form-control"
                        id="text"
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                </div>
                <ErrorMessage component="div" style={{'color': 'red'}} name="text"/>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        as="select"
                        className="form-select"
                        id="element"
                        name="element">
                        <option>Я владею элементом...</option>
                        {renderFilters(filters, filtersLoadingStatus)}
                    </Field>
                </div>
                <ErrorMessage component="div" style={{'color': 'red'}} name="select"/>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;