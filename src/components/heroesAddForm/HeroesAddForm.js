import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import {useHttp} from "../../hooks/http.hook";
import {useDispatch} from "react-redux";
import {heroCreated} from "../../actions";


const HeroesAddForm = () => {
    const {request} = useHttp();
    const dispatch = useDispatch();

    const addHero = (values) => {
        const newHero = {
            id: uuidv4(),
            ...values
        }
        request(`http://localhost:3001/heroes/`, "POST", JSON.stringify(newHero))
            .then(dispatch(heroCreated(newHero)))
            .catch(err => console.log(err));
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
                        <option >Я владею элементом...</option>
                        <option value="fire">Огонь</option>
                        <option value="water">Вода</option>
                        <option value="wind">Ветер</option>
                        <option value="earth">Земля</option>
                    </Field>
                </div>
                <ErrorMessage component="div" style={{'color': 'red'}} name="select"/>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;